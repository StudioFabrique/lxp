import { type Request, type Response } from "express";
import { validateFirstAdminToken } from "../../models/auth/setup.ts";

export default async function httpPostVerifyActivationToken(
  req: Request,
  res: Response,
) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Un token est requis." });
    }

    await validateFirstAdminToken(token.toString());
    return res.status(200).json({ valid: true });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({
        message:
          error.message ?? "Une erreur est survenue lors de la vérification.",
      });
  }
}
