import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import postReportQuizQuestion from "../../models/quiz/post-report-quiz-question.ts";

/**
 * POST /quiz/question/report
 * Enregistre un signalement d'anomalie pour une question de quiz spécifique.
 */
export default async function httpPostReportQuizQuestion(
  req: CustomRequest,
  res: Response,
) {
  const { externalId, comment } = req.body;
  const { userId } = req.auth ?? {};

  try {
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const report = await postReportQuizQuestion(String(externalId), comment);
    if (!report) {
      return res
        .status(404)
        .json({ error: "La question spécifiée n'existe pas." });
    }

    return res.status(201).json({
      message: "Signalement enregistré avec succès.",
      reportId: report.id,
    });
  } catch (error) {
    console.error("Erreur lors du signalement de la question :", error);
    return res
      .status(500)
      .json({ error: "Impossible d'enregistrer le signalement." });
  }
}
