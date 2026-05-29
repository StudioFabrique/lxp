import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { fastApiAgent } from "../../server";
import { fetch } from "undici";
import postDialogs from "../../models/chatbot/post-dialogs";
import { trackTokens } from "../../models/stats/trackTokens";
import { prisma } from "../../utils/db";

export default async function httpPostPrompt(
  req: CustomRequest,
  res: Response,
) {
  try {
    const userId = req.auth?.userId || "anonymous_student";

    const course =
      req.body.courseId &&
      (await prisma.course.findUnique({
        where: { id: req.body.courseId },
        select: { courseSlug: true },
      }));

    const courseSlug = course?.courseSlug || undefined;

    const dockerIa = process.env.FASTAPI_URL || "http://localhost:8000";

    const fetchOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        question: req.body.prompt,
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

    console.warn(
      `[RAG] Mode (${data.answer?.mode}). Score max: ${data.meta?.retrieval?.best_score}`,
    );

    const markdownContent =
      data.answer?.text || "Désolé, aucune réponse n'a pu être générée.";

    // Evite de polluer la BDD si l'étudiant est anonyme
    if (userId && userId !== "anonymous_student") {
      const lastDialogs = [
        { origin: "user" as const, message: req.body.prompt, date: new Date() },
        { origin: "bot" as const, message: markdownContent, date: new Date() },
      ];

      // Récupérer les tokens si FastAPI les inclut dans sa réponse JSON
      const aiTokens = (data.meta.usage.total_tokens as number) || 0;

      console.log({ aiTokens });

      if (aiTokens) {
        await trackTokens(userId, aiTokens);
      }

      await postDialogs(userId, lastDialogs);
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json({ text: markdownContent });
  } catch (error) {
    console.error("Erreur dans httpPostPrompt:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
