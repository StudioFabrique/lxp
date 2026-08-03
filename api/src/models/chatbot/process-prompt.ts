import { sign } from "jsonwebtoken";
import { prisma } from "../../utils/db";
import type { CourseSource } from "../../utils/interfaces/db/chat-dialogs";
import postDialogs, { clearDialogs } from "./post-dialogs";
import resolveSourceTarget from "./resolve-source-target";
import { trackTokens } from "../stats/trackTokens";

type FastApiResponse = {
  status: { type: "ok" | "error" | "refusal" };
  answer: { mode: string; text: string };
  sources: CourseSource[];
  meta?: { usage?: { total_tokens?: number }; retrieval?: { best_score?: number } };
};

export type ProcessPromptInput = {
  userId: string;
  prompt: string;
  fullPrompt?: string;
  courseId?: number;
  clearHistory?: boolean;
  textSelection?: string | null;
};

export class PromptProcessingError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: Record<string, unknown>,
  ) {
    super(typeof body.error === "string" ? body.error : "Prompt processing failed");
  }
}

export default async function processPrompt(input: ProcessPromptInput) {
  const baseUrl = process.env.DOCKER_IA_API_BASE_URL || "http://localhost:8000";
  const secret = process.env.DOCKER_IA_AUTH_SECRET;
  if (!secret) {
    throw new PromptProcessingError(500, {
      error:
        "Internal server error : Le secret JWT pour le docker IA n'est pas configuré",
    });
  }

  const token = sign(
    { sub: input.userId, userRoles: [{ role: "admin" }] },
    secret,
  );
  if (input.clearHistory && input.userId !== "anonymous_student") {
    try {
      await fetch(`${baseUrl}/stm/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: input.userId }),
      });
      await clearDialogs(input.userId);
    } catch (error) {
      console.error("[RAG RESET ERROR]", error);
    }
  }

  const course = input.courseId
    ? await prisma.course.findUnique({
        where: { id: input.courseId },
        select: { courseSlug: true },
      })
    : null;
  const courseSlug = course?.courseSlug || undefined;
  if (input.courseId && !courseSlug) {
    throw new PromptProcessingError(409, {
      code: "AI_CONTENT_NOT_INDEXED",
      error: "Les fonctionnalités IA de ce cours copié ne sont pas indexées.",
    });
  }

  const response = await fetch(`${baseUrl}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: input.userId,
      question: input.fullPrompt || input.prompt,
      course_slug: courseSlug,
      threshold: 0.7,
      student_profile: {
        user_id: input.userId,
        course_id: courseSlug,
        tempo_label: "normal",
        experience_label: "intermediaire",
        weak_concepts: [],
        preferences: ["exemples concrets"],
        metrics: {},
      },
    }),
  });
  if (!response.ok) {
    throw new PromptProcessingError(response.status, {
      error: "Erreur provenant de FastAPI",
    });
  }

  const payload = (await response.json()) as FastApiResponse;
  const text = payload.answer?.text || "Désolé, aucune réponse n'a pu être générée.";
  const type =
    payload.status?.type === "refusal"
      ? "warning"
      : payload.status?.type === "error"
        ? "error"
        : "normal";
  const data = {
    text,
    type,
    mode: payload.answer?.mode,
    sources: payload.sources || [],
  };

  if (input.userId !== "anonymous_student") {
    const totalTokens = payload.meta?.usage?.total_tokens || 0;
    if (totalTokens) await trackTokens(input.userId, totalTokens);
    await postDialogs(
      input.userId,
      [
        { origin: "user", message: input.prompt, date: new Date() },
        { origin: "bot", message: text, date: new Date() },
      ],
      payload.sources,
      input.textSelection,
    );
    data.sources = await Promise.all(
      data.sources.map(async (source) => ({
        ...source,
        ...(await resolveSourceTarget(source)),
      })),
    );
  }

  return data;
}
