import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { confirmEmailChange } from "../../models/user/change-email.ts";

export default async function httpPostConfirmEmail(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const email = await confirmEmailChange(req.body.token);
    return res.status(200).json({
      success: true,
      email,
      message: "Votre nouvelle adresse email est validée.",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message:
        error.message ?? "La nouvelle adresse email n'a pas pu être validée.",
    });
  }
}
