import { validationResult } from "express-validator";
import { type Response } from "express";
import { promoteAdminToRoot } from "../../models/auth/setup.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostPromoteRoot(
  req: CustomRequest,
  res: Response,
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    await promoteAdminToRoot(req.body.token, req.auth!.userId);
    return res.status(200).json({
      success: true,
      message: "Votre compte possède maintenant le rôle root.",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message:
        error.message ??
        "Une erreur est survenue lors de la promotion du compte.",
    });
  }
}
