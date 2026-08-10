import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import resendActivationEmail from "../../models/auth/resend-activation-email.ts";
import { ACTIVATION_EMAIL_COOLDOWN_MS } from "../../utils/services/auth/activation-email-cooldown.ts";

export default async function httpPostResendActivation(
  req: Request,
  res: Response,
) {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({
      message: validation.array()[0]?.msg ?? "Adresse email invalide.",
    });
  }

  try {
    await resendActivationEmail(req.body.email);

    return res.status(200).json({
      success: true,
      message:
        "Si ce compte est en attente d'activation, un nouveau lien vient d'être envoyé.",
      retryAfterSeconds: ACTIVATION_EMAIL_COOLDOWN_MS / 1000,
    });
  } catch (error: any) {
    if (error.retryAfterSeconds) {
      res.setHeader("Retry-After", error.retryAfterSeconds);
    }

    return res.status(error.status ?? 500).json({
      code: error.code,
      message:
        error.message ?? "Le lien d'activation n'a pas pu être envoyé.",
      retryAfterSeconds: error.retryAfterSeconds,
    });
  }
}
