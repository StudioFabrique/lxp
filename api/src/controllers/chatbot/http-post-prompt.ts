import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { fastApiAgent } from "../../server";
import { fetch } from "undici";

export default async function httpPostPrompt(
  req: CustomRequest,
  res: Response,
) {
  try {
    const userId = req.auth?.userId || "anonymous_student";

    // Formatage du slug du cours
    // const courseSlug = req.body.courseTitle
    //   ? req.body.courseTitle.trim().replace(/\s+/g, "-").toLowerCase()
    //   : undefined;

    const courseSlug = "node-js";

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

    // Ajouter l'agent mTLS si configuré pour HTTPS
    if (fastApiAgent && dockerIa.startsWith("https://")) {
      fetchOptions.dispatcher = fastApiAgent;
    }

    // Appel direct à /ask
    const response = await fetch(`${dockerIa}/ask`, fetchOptions);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Erreur provenant de FastAPI" });
    }

    // Récupération de la réponse JSON complète
    const data = (await response.json()) as any;

    if (data.answer?.mode === "model_knowledge") {
      console.warn(
        `[RAG] Mode fallback activé. Score max: ${data.meta?.retrieval?.best_score}`,
      );
    }

    const markdownContent =
      data.answer?.text || "Désolé, aucune réponse n'a pu être générée.";

    // Envoi propre du JSON attendu par ton hook Front-End 'useChatbot'
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json({ text: markdownContent });
  } catch (error) {
    console.error("Erreur dans httpPostPrompt:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
