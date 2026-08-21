import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import {
  accessExpire,
  refreshExpire,
  isDemoMode,
  sessionCookieOptions,
} from "../../config/config.ts";
import { setTokens } from "../../utils/services/auth/set-tokens.ts";
import {
  AltchaError,
  verifySolution,
} from "../../utils/services/demo/altcha.ts";
import getDemoUser, {
  DemoAccountError,
  type DemoProfile,
} from "../../models/demo/get-demo-user.ts";
import { logger } from "../../utils/logs/logger.ts";

/**
 * Ouvre une session de démonstration après vérification du défi anti-robot.
 *
 * Aucun code 401 ni 403 n'est renvoyé, volontairement : l'intercepteur du front
 * (`front/src/lib/axios.ts`) ne réagit qu'à ces deux-là, en déclenchant un
 * rafraîchissement de session puis une déconnexion. En restant sur 400, 429 et
 * 503, la page publique traverse l'intercepteur sans le réveiller.
 *
 * La réponse ne porte pas l'utilisateur : le front enchaîne sur `handshake()`,
 * ce qui lui donne exactement la même forme de session que partout ailleurs.
 */
export default async function httpPostDemoSession(
  req: Request,
  res: Response,
) {
  if (!isDemoMode()) {
    return res.status(404).json({ message: "Ressource introuvable" });
  }

  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({ message: validation.array()[0].msg });
  }

  const profile = req.body.profile as DemoProfile;

  try {
    verifySolution(req.body.solution);
  } catch (error) {
    if (error instanceof AltchaError) {
      return res.status(400).json({ message: error.message });
    }
    logger.error(error);
    return res.status(503).json({
      message: "La démonstration est momentanément indisponible.",
    });
  }

  try {
    const userId = await getDemoUser(profile);

    return res
      .cookie(
        "accessToken",
        setTokens(userId, "access", accessExpire),
        sessionCookieOptions("accessToken"),
      )
      .cookie(
        "refreshToken",
        setTokens(userId, "refresh", refreshExpire),
        sessionCookieOptions("refreshToken"),
      )
      .status(200)
      .json({ ok: true, layout: profile === "admin" ? "admin" : "student" });
  } catch (error) {
    logger.error(error);
    const message =
      error instanceof DemoAccountError
        ? "La démonstration n'est pas configurée sur cette instance."
        : "La démonstration est momentanément indisponible.";
    return res.status(503).json({ message });
  }
}
