import { type Request, type Response } from "express";
import { createChallenge } from "../../utils/services/demo/altcha.ts";
import { logger } from "../../utils/logs/logger.ts";

/** Émet un défi anti-robot pour l'ouverture d'une session de démonstration. */
export default function httpGetDemoChallenge(_req: Request, res: Response) {
  try {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(createChallenge());
  } catch (error) {
    logger.error(error);
    return res.status(503).json({
      message: "La démonstration est momentanément indisponible.",
    });
  }
}
