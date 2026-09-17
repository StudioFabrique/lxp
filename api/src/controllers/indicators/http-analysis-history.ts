import type { NextFunction, Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { getAnalysisHistory, saveAnalysisFeedback } from "../../models/indicators/analysis-history.ts";
import { logger } from "../../utils/logs/logger.ts";

export function requireAnalysisStaff(req: CustomRequest, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ message: "Session absente ou expirée" });
  if ((req.auth.userRoles[0]?.rank ?? Infinity) > 2) {
    return res.status(403).json({ message: "L'analyse est réservée à l'équipe pédagogique." });
  }
  next();
}

export async function httpAnalysisHistory(req: CustomRequest, res: Response) {
  try {
    return res.json(await getAnalysisHistory(req.params.userId!, req.query.before as string | undefined));
  } catch (error) {
    logger.error("Lecture de l'historique des analyses", error);
    return res.status(500).json({ message: "Impossible de charger l'historique des analyses." });
  }
}

export async function httpAnalysisFeedback(req: CustomRequest, res: Response) {
  try {
    const feedback = await saveAnalysisFeedback(req.params.userId!, req.params.analysisId!, req.auth!.userId, req.body);
    return res.status(201).json(feedback);
  } catch (error) {
    if (error instanceof Error && "statusCode" in error && typeof error.statusCode === "number") {
      return res.status(error.statusCode).json({ message: error.message });
    }
    logger.error("Enregistrement du retour d'analyse", error);
    return res.status(500).json({ message: "Impossible d'enregistrer le retour." });
  }
}
