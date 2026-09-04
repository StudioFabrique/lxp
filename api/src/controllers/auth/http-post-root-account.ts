import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import {
  accessExpire,
  refreshExpire,
  sessionCookieOptions,
} from "../../config/config.ts";
import { createRootAccount } from "../../models/auth/setup.ts";
import { setTokens } from "../../utils/services/auth/set-tokens.ts";

export default async function httpPostRootAccount(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const userId = await createRootAccount(req.body);
    const accessToken = setTokens(userId, "access", accessExpire);
    const refreshToken = setTokens(userId, "refresh", refreshExpire);

    return res
      .cookie("accessToken", accessToken, sessionCookieOptions("accessToken"))
      .cookie(
        "refreshToken",
        refreshToken,
        sessionCookieOptions("refreshToken"),
      )
      .status(201)
      .json({ success: true, message: "Compte root créé avec succès." });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message:
        error.message ??
        "Une erreur est survenue lors de la création du compte root.",
    });
  }
}
