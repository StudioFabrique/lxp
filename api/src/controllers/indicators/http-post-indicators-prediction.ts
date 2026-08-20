import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import predictOutcome from "../../models/indicators/predict-outcome.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

/** Rang au-delà duquel l'utilisateur est un apprenant. */
const STUDENT_RANK_THRESHOLD = 2;

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function httpPostIndicatorsPrediction(
  req: CustomRequest,
  res: Response,
) {
  const auth = req.auth;

  if (!auth) {
    return res.status(401).json({ message: "Session absente ou expirée" });
  }

  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: badQuery });
  }

  // Contrairement aux indicateurs bruts, la prédiction n'est jamais rendue à
  // l'apprenant, même sur sa propre fiche : annoncer à quelqu'un qu'un modèle
  // le classe en abandon probable relève de l'accompagnement, pas de l'affichage.
  const rank = auth.userRoles[0]?.rank ?? Number.MAX_SAFE_INTEGER;

  if (rank > STUDENT_RANK_THRESHOLD) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé à interroger le modèle de prédiction",
    });
  }

  try {
    const prediction = await predictOutcome(
      userId,
      parseDate(req.query.from),
      parseDate(req.query.to),
    );

    return res.status(200).json(prediction);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
