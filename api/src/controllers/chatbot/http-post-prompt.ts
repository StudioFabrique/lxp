import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postDialogs from "../../models/chatbot/post-dialogs";
import { trackTokens } from "../../models/stats/trackTokens";
import { prisma } from "../../utils/db";
import { sign } from "jsonwebtoken";
import ChatDialogs, {
  CourseSource,
} from "../../utils/interfaces/db/chat-dialogs";

interface FastApiResponse {
  request: {
    user_id: string;
    session_id: string;
    question: string;
    timestamp_utc: string;
  };
  status: {
    type: "ok" | "error" | "refusal";
    code: string;
    message: string | null;
  };
  answer: {
    mode: "course_content" | "general_knowledge" | string;
    text: string;
    language: string;
    confidence: number;
    safety: { input_toxic: boolean; output_toxic: boolean };
  };
  warnings: any[];
  recommendations: { course: any[]; conceptual: any[] };
  sources: CourseSource[];
  meta: {
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    question_type: string | null;
    topic: string;
    retrieval: {
      best_score: number;
      selected_count: number;
      index_type: string;
      windows_ok: boolean;
      normalize_embeddings: boolean;
      embedding_model: string;
      course_filter: string;
    };
  };
}

type SourcesWithIds = CourseSource &
  Partial<{ moduleId: number; lessonId: number }>;

interface FinalResponse {
  text: string;
  type: "error" | "normal" | "warning";
  mode: string;
  sources: SourcesWithIds[];
}

export default async function httpPostPrompt(
  req: CustomRequest,
  res: Response,
) {
  try {
    const userId = req.auth?.userId || "anonymous_student";
    // Récupération de textSelection depuis le body
    const { prompt, fullPrompt, courseId, clearHistory, textSelection } =
      req.body;

    const dockerIa =
      process.env.DOCKER_IA_API_BASE_URL || "http://localhost:8000";

    const secret = process.env.DOCKER_IA_AUTH_SECRET;

    if (!secret)
      return res.status(500).json({
        error:
          "Internal server error : Le secret JWT pour le docker IA n'est pas configuré",
      });

    const token = sign(
      {
        sub: userId,
        userRoles: [{ role: "admin" }],
      },
      secret,
    );

    if (clearHistory && userId !== "anonymous_student") {
      try {
        // Reset de la mémoire (STM) dans FastAPI
        await fetch(`${dockerIa}/stm/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        });

        // Reset de l'historique dans MongoDB
        await ChatDialogs.deleteMany({ userId });
      } catch (resetError) {
        console.error("[RAG RESET ERROR]", resetError);
      }
    }

    const course =
      courseId &&
      (await prisma.course.findUnique({
        where: { id: courseId },
        select: { courseSlug: true },
      }));

    const courseSlug = course?.courseSlug || undefined;
    if (courseId && !courseSlug) {
      return res.status(409).json({
        code: "AI_CONTENT_NOT_INDEXED",
        error:
          "Les fonctionnalités IA de ce cours copié ne sont pas indexées.",
      });
    }

    const fetchOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        question: fullPrompt || prompt,
        course_slug: courseSlug,
        threshold: 0.7,
        student_profile: {
          user_id: userId,
          course_id: courseSlug,
          tempo_label: "normal",
          experience_label: "intermediaire",
          weak_concepts: [],
          preferences: ["exemples concrets"],
          metrics: {},
        },
      }),
    };

    const response = await fetch(`${dockerIa}/ask`, fetchOptions);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Erreur provenant de FastAPI" });
    }

    const jsonResponse = (await response.json()) as FastApiResponse;

    let messageType: "normal" | "warning" | "error" = "normal";
    if (jsonResponse.status?.type === "refusal") {
      messageType = "warning";
    } else if (jsonResponse.status?.type === "error") {
      messageType = "error";
    }

    console.warn(
      `[RAG] Mode (${jsonResponse.answer?.mode}). Score max: ${jsonResponse.meta?.retrieval?.best_score}`,
    );

    const markdownContent =
      jsonResponse.answer?.text ||
      "Désolé, aucune réponse n'a pu être générée.";

    const data: FinalResponse = {
      text: markdownContent,
      type: messageType,
      mode: jsonResponse.answer?.mode,
      sources: jsonResponse.sources || [],
    };

    if (userId && userId !== "anonymous_student") {
      const lastDialogs = [
        { origin: "user" as const, message: prompt, date: new Date() },
        { origin: "bot" as const, message: markdownContent, date: new Date() },
      ];

      const aiTokens = jsonResponse.meta?.usage?.total_tokens || 0;

      if (aiTokens) {
        await trackTokens(userId, aiTokens);
      }

      // Transmission du dialogue avec le chatbot avec les sources et textSelection en base de données
      await postDialogs(
        userId,
        lastDialogs,
        jsonResponse.sources,
        textSelection,
      );

      data.sources = await Promise.all(
        data.sources?.map(async (source) => {
          const lesson = await prisma.lesson.findFirst({
            select: {
              id: true,
              course: { select: { moduleId: true } },
            },
            where: { course: { courseSlug: source.course } },
          });

          return {
            ...source,
            moduleId: lesson?.course.moduleId,
            lessonId: lesson?.id,
          };
        }),
      );
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
