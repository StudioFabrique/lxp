import { type NextFunction, type Response } from "express";

import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

/**
 * Met en forme les réponses des contrôleurs qui délèguent via
 * `next({ statusCode, data })`.
 *
 * La journalisation n'est plus faite ici : elle dépendait alors du style
 * d'écriture du contrôleur. `request-logger` s'accroche à la fin de chaque
 * réponse et couvre donc l'ensemble du trafic.
 */
export default function responseHandler(
  data: { statusCode: number; data?: any; message?: string },
  _req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  if (!data) return next();

  if (data.statusCode < 400) {
    return res.status(data.statusCode).json(data.data);
  }

  return res.status(data.statusCode).json({ message: data.message });
}
