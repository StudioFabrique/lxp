import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { confirmRootEmail } from "../../models/auth/confirm-root-email.ts";
import { confirmEmailChange } from "../../models/user/change-email.ts";

export default async function httpPostConfirmEmail(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const decoded = jwt.decode(req.body.token);
    const isRootActivation =
      typeof decoded === "object" &&
      decoded !== null &&
      decoded.purpose === "root-email-verification";
    const email = isRootActivation
      ? await confirmRootEmail(req.body.token)
      : await confirmEmailChange(req.body.token);

    return res.status(200).json({
      success: true,
      email,
      message: isRootActivation
        ? "Votre adresse email est validée et votre compte root est activé."
        : "Votre nouvelle adresse email est validée.",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message:
        error.message ?? "L'adresse email n'a pas pu être validée.",
    });
  }
}
