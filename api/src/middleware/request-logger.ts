import { type NextFunction, type Request, type Response } from "express";
import { logger } from "../utils/logs/logger.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import { clientIp } from "./rate-limiter.ts";

/**
 * Journalise chaque réponse, quelle que soit la façon dont le contrôleur l'a
 * produite.
 *
 * La trace applicative était jusqu'ici posée par `response-handler`, donc
 * uniquement pour les contrôleurs passant par `next({ statusCode })` : trente
 * sur deux cent quatorze. Tout le reste du trafic — dont l'authentification et
 * la quasi-totalité des lectures — ne laissait aucune trace exploitable.
 *
 * S'accrocher à la fin de la réponse plutôt qu'à un style d'écriture rend la
 * journalisation indépendante des contrôleurs, et donc impossible à oublier.
 */
export default function requestLogger(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const role = req.auth?.userRoles?.[0]?.label ?? "anonyme";
    const userId = req.auth?.userId ?? "-";

    // `req.route` est absent sur les 404 : on retombe alors sur le chemin brut.
    const entry = {
      from: clientIp(req as Request),
      user: `${userId}-${role}`,
      method: req.method,
      path: req.originalUrl.split("?")[0],
      status: res.statusCode,
      durationMs: Math.round(durationMs),
    };

    // Le libellé reste court et les champs sont posés à plat : imbriquer
    // l'ensemble sous `message` rendrait les journaux difficiles à filtrer.
    const label = `${entry.method} ${entry.path} ${entry.status}`;

    if (res.statusCode >= 500) logger.error(label, entry);
    else if (res.statusCode >= 400) logger.warn(label, entry);
    else logger.info(label, entry);
  });

  next();
}
