import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { fastApiAgent } from "../../server";
import { fetch } from "undici";
import postDialogs from "../../models/chatbot/post-dialogs";
import { trackTokens } from "../../models/stats/trackTokens";
import { prisma } from "../../utils/db";
import ChatDialogs from "../../utils/interfaces/db/chat-dialogs";

export default async function httpPostPrompt(
  req: CustomRequest,
  res: Response,
) {
  try {
    const userId = req.auth?.userId || "anonymous_student";
    const { prompt, courseId, clearHistory } = req.body;

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        question: prompt,
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

    const data = (await response.json()) as any;

    // Détermination du type de message en fonction du statut de l'API RAG
    let messageType: "normal" | "warning" | "error" = "normal";
    if (data.status?.type === "refusal") {
      messageType = "warning"; // Cas TOXIC_INPUT ou TOXIC_OUTPUT
    } else if (data.status?.type === "error") {
      messageType = "error"; // Cas d'erreur de génération interne
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

      const aiTokens = (data.meta?.usage?.total_tokens as number) || 0;

      if (aiTokens) {
        await trackTokens(userId, aiTokens);
      }

      await postDialogs(userId, lastDialogs);
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json({ text: markdownContent, type: messageType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
