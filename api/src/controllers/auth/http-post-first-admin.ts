import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { accessExpire, refreshExpire, tokensMaxAge } from "../../config/config.ts";
import { createFirstAdmin } from "../../models/auth/setup.ts";
import { regexMail, regexPassword } from "../../utils/constantes.ts";
import { setTokens } from "../../utils/services/auth/set-tokens.ts";

export default async function httpPostFirstAdmin(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { token, email, firstname, lastname, password } = req.body;
    if (!token || !email || !firstname || !lastname || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }
    if (!regexMail.test(email)) {
      return res
        .status(400)
        .json({ message: "L'adresse email n'est pas valide." });
    }
    if (!regexPassword.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    const userId = await createFirstAdmin({
      token,
      email,
      firstname,
      lastname,
      password,
    });
    const accessToken = setTokens(userId, "access", accessExpire);
    const refreshToken = setTokens(userId, "refresh", refreshExpire);

    return res
      .cookie("accessToken", accessToken, {
        maxAge: tokensMaxAge.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: tokensMaxAge.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, message: "Administrateur créé avec succès." });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message:
        error.message ??
        "Une erreur est survenue lors de la création de l'administrateur.",
    });
  }
}
