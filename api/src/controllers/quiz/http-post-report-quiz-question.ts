import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { prisma } from "../../utils/db";

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

    // 1. Vérification de l'existence de la question
    const questionExists = await prisma.quizQuestion.findFirst({
      where: { externalId: String(externalId) },
    });

    if (!questionExists) {
      return res
        .status(404)
        .json({ error: "La question spécifiée n'existe pas." });
    }

    // Création du signalement en BDD
    const report = await prisma.quizQuestionReport.create({
      data: {
        quizQuestionId: questionExists.id,
        commentaire: comment,
        // reportedBy: userId,
      },
    });

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
