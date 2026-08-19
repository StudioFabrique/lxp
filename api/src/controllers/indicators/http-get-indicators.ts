import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import getAllIndicators from "../../models/indicators/get-all-indicators.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

/** Rang au-delà duquel l'utilisateur est un apprenant. */
const STUDENT_RANK_THRESHOLD = 2;

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function httpGetIndicators(
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

  // La permission `stats:read` est aussi accordée aux apprenants, pour leur
  // propre tableau de bord. Sans ce contrôle, n'importe lequel d'entre eux
  // pourrait lire les indicateurs d'un camarade.
  const rank = auth.userRoles[0]?.rank ?? Number.MAX_SAFE_INTEGER;

  if (rank > STUDENT_RANK_THRESHOLD && userId !== auth.userId) {
    return res.status(403).json({
      message: "Vous n'êtes pas autorisé à consulter ces indicateurs",
    });
  }

  try {
    const payload = await getAllIndicators(
      userId,
      parseDate(req.query.from),
      parseDate(req.query.to),
    );

    return res.status(200).json(payload);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
