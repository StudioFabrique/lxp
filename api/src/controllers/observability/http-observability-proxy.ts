import { type Request, type Response } from "express";
import { logger } from "../../utils/logs/logger.ts";
import {
  forwardToVictoriaLogs,
  MAX_POST_BODY_BYTES,
  type ForwardBody,
  isObservabilityAvailable,
  ObservabilityForbiddenPathError,
  ObservabilityUnavailableError,
} from "../../utils/services/observability/victorialogs-proxy.ts";

/**
 * Relaie l'interface de consultation des journaux (VictoriaLogs).
 *
 * L'accès est réservé au root par la route (`checkPermissions` puis
 * `checkRoleRank([0])`). Ce contrôleur ne relaie que des lectures.
 */
export default async function httpObservabilityProxy(
  req: Request,
  res: Response,
) {
  const method =
    req.method === "POST" ? "POST" : req.method === "HEAD" ? "HEAD" : "GET";

  let body: ForwardBody | undefined;
  if (method === "POST") {
    const length = Number(req.headers["content-length"]);
    if (!Number.isFinite(length) || length > MAX_POST_BODY_BYTES) {
      return res.status(413).json({ message: "Requête trop volumineuse." });
    }
    const contentType = req.headers["content-type"] ?? "";
    // `express.json()` a déjà consommé un corps JSON : on le re-sérialise.
    // Un formulaire n'est pas lu en amont, le flux est relayé tel quel.
    body = contentType.includes("application/json")
      ? { content: JSON.stringify(req.body ?? {}), contentType }
      : { content: req, contentType: contentType || "application/x-www-form-urlencoded" };
  }
  const abort = new AbortController();
  res.on("close", () => abort.abort());

  try {
    const upstream = await forwardToVictoriaLogs(
      method,
      req.originalUrl,
      abort.signal,
      body,
    );

    res.status(upstream.status).set(upstream.headers);
    if (!upstream.body) return res.end();
    upstream.body.on("error", () => res.destroy());
    upstream.body.pipe(res);
  } catch (error: unknown) {
    if (abort.signal.aborted) return;
    if (
      error instanceof ObservabilityUnavailableError ||
      error instanceof ObservabilityForbiddenPathError
    ) {
      // Même réponse qu'une route inconnue : on ne révèle pas la présence du module.
      return res.status(404).json({ message: "Ressource introuvable." });
    }
    logger.error("observability.proxy", {
      error: error instanceof Error ? error.message : "inconnue",
    });
    return res.status(502).json({
      message: "Le service de journaux est indisponible. Réessayez plus tard.",
    });
  }
}

/** Indique à l'interface si le lien vers les journaux doit être proposé. */
export function httpObservabilityStatus(_req: Request, res: Response) {
  res.json({ enabled: isObservabilityAvailable() });
}
