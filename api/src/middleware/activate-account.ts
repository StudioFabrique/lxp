import { type Response, type NextFunction } from "express";
import { badQuery } from "../utils/constantes.ts";
import jwt from "jsonwebtoken";
import User from "../utils/interfaces/db/user.ts";

import BlackListedToken from "../utils/interfaces/db/blacklisted-token.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import { buildAbility } from "../utils/rbac/ability.ts";
import { env } from "../config/env.ts";

export default async function activateAccount(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const message = "Ce lien n'est plus valide.";
    const { token } = req.body;

    if (!token) throw { statusCode: 400, message: "Un token est requis" };
    let data: jwt.JwtPayload;
    try {
      data = jwt.verify(String(token), env.REGISTER_SECRET) as jwt.JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // La signature reste obligatoire avant d'utiliser l'identité portée
        // par le lien expiré pour préremplir le formulaire de renvoi.
        const expired = jwt.verify(String(token), env.REGISTER_SECRET, {
          ignoreExpiration: true,
        }) as jwt.JwtPayload;
        if (expired.purpose !== "activation") {
          return res.status(401).json({ message });
        }
        const user = await User.findById(expired.userId).select(
          "email invitationSent isActive emailVerified",
        );
        if (!user?.invitationSent || user.isActive || user.emailVerified) {
          return res.status(401).json({ message });
        }
        return res.status(410).json({
          code: "ACTIVATION_LINK_EXPIRED",
          message: "Ce lien d'activation a expiré.",
          email: user.email,
        });
      }
      return res.status(401).json({ message });
    }

    if (
      (data.purpose !== "activation" && data.purpose !== "password-reset") ||
      (req.path === "/check-invitation" && data.purpose !== "activation")
    ) {
      return res.status(401).json({ message });
    }

    const existingBlacklistedToken = await BlackListedToken.findOne({ token });
    if (existingBlacklistedToken) {
      return res.status(400).json({ message });
    }
    const ability = buildAbility([]);
    req.auth = {
      userId: data.userId,
      userRoles: data.userRoles,
      ability,
      abilityRules: ability.rules,
      passwordTokenPurpose: data.purpose,
    };
    next();
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
