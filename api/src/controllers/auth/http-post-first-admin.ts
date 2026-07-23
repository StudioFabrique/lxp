import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { validationResult } from "express-validator";
import User from "../../utils/interfaces/db/user";
import Role from "../../utils/interfaces/db/role";
import { prisma } from "../../utils/db";
import { setTokens } from "../../utils/services/auth/set-tokens";
import { accessExpire, refreshExpire, tokensMaxAge } from "../../config/config";
import { regexPassword, regexMail } from "../../utils/constantes";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token";

export default async function httpPostFirstAdmin(
  req: Request,
  res: Response,
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array()[0].msg });
    }

    const { token, email, firstname, lastname, password } = req.body;

    if (!token || !email || !firstname || !lastname || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    if (!regexMail.test(email)) {
      return res.status(400).json({ message: "L'adresse email n'est pas valide." });
    }

    if (!regexPassword.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    let data: any;
    try {
      data = jwt.verify(token.toString(), process.env.REGISTER_SECRET!);
    } catch {
      return res
        .status(401)
        .json({ message: "Le token est invalide ou a expiré." });
    }

    if (data.purpose !== "first-admin") {
      return res
        .status(401)
        .json({ message: "Le token n'est pas valide pour cette opération." });
    }

    const existingBlacklistedToken = await BlackListedToken.findOne({ token });
    if (existingBlacklistedToken) {
      return res
        .status(400)
        .json({ message: "Ce token a déjà été utilisé." });
    }

    const adminRole = await Role.findOne({ role: "admin" });
    if (!adminRole) {
      return res
        .status(500)
        .json({ message: "Le rôle administrateur n'existe pas." });
    }

    const adminCount = await User.countDocuments({
      roles: adminRole._id,
      isActive: true,
    });
    if (adminCount > 0) {
      return res.status(400).json({
        message:
          "Un administrateur existe déjà. Ce token n'est plus valide.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message:
          "Un utilisateur a déjà été enregistré avec cette adresse email.",
      });
    }

    const interfaceRole = await Role.findOne({ rank: 1, role: "interface:admin" });

    const roles = interfaceRole
      ? [new Object(adminRole._id), new Object(interfaceRole._id)]
      : [new Object(adminRole._id)];

    const hashedPassword = await hash(password, 10);

    const createdUser = await User.create({
      email: email.toLowerCase(),
      firstname: firstname.toLowerCase(),
      lastname: lastname.toLowerCase(),
      password: hashedPassword,
      isActive: true,
      emailVerified: true,
      roles,
    });

    await prisma.admin.create({ data: { idMdb: createdUser._id } });

    await BlackListedToken.create({ token });

    const accessToken = setTokens(
      createdUser._id,
      "access",
      accessExpire,
    );
    const refreshToken = setTokens(
      createdUser._id,
      "refresh",
      refreshExpire,
    );

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
      .json({
        success: true,
        message: "Administrateur créé avec succès.",
      });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message:
        error.message ??
        "Une erreur est survenue lors de la création de l'administrateur.",
    });
  }
}
