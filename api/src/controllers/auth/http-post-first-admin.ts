import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { createFirstAdmin } from "../../models/auth/setup.ts";
import { regexMail, regexNewPassword } from "../../utils/constantes.ts";

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
    if (!regexNewPassword.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    await createFirstAdmin({
      token,
      email,
      firstname,
      lastname,
      password,
    });
    return res.status(201).json({
      success: true,
      pendingActivation: true,
      message:
        "Un lien d'activation a été envoyé à votre adresse email.",
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message:
        error.message ??
        "Une erreur est survenue lors de la création de l'administrateur.",
    });
  }
}
