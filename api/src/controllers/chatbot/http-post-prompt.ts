import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { fastApiAgent } from "../../server";
import { fetch } from "undici";
import postDialogs from "../../models/chatbot/post-dialogs";
import { trackTokens } from "../../models/stats/trackTokens";
import { prisma } from "../../utils/db";
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

export default async function httpPostPrompt(
  req: CustomRequest,
  res: Response,
) {
  try {
    const userId = req.auth?.userId || "anonymous_student";
    // Récupération de textSelection depuis le body
    const { prompt, fullPrompt, courseId, clearHistory, textSelection } =
      req.body;

    const dockerIa = process.env.FASTAPI_URL || "http://localhost:8000";

    if (clearHistory && userId !== "anonymous_student") {
      try {
        // Reset de la mémoire (STM) dans FastAPI
        await fetch(`${dockerIa}/stm/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
          ...(fastApiAgent && dockerIa.startsWith("https://")
            ? { dispatcher: fastApiAgent }
            : {}),
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

    const fetchOptions: any = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    if (fastApiAgent && dockerIa.startsWith("https://")) {
      fetchOptions.dispatcher = fastApiAgent;
    }

    const response = await fetch(`${dockerIa}/ask`, fetchOptions);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Erreur provenant de FastAPI" });
    }

    const data = (await response.json()) as FastApiResponse;

    let messageType: "normal" | "warning" | "error" = "normal";
    if (data.status?.type === "refusal") {
      messageType = "warning";
    } else if (data.status?.type === "error") {
      messageType = "error";
    }

    console.warn(
      `[RAG] Mode (${data.answer?.mode}). Score max: ${data.meta?.retrieval?.best_score}`,
    );

    const markdownContent =
      data.answer?.text || "Désolé, aucune réponse n'a pu être générée.";

    if (userId && userId !== "anonymous_student") {
      const lastDialogs = [
        { origin: "user" as const, message: prompt, date: new Date() },
        { origin: "bot" as const, message: markdownContent, date: new Date() },
      ];

      const aiTokens = data.meta?.usage?.total_tokens || 0;

      if (aiTokens) {
        await trackTokens(userId, aiTokens);
      }

      // AJOUT : Transmission de sources et textSelection en base de données
      await postDialogs(userId, lastDialogs, data.sources, textSelection);
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");

    return res.status(200).json({
      text: markdownContent,
      type: messageType,
      mode: data.answer?.mode,
      sources: data.sources || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
