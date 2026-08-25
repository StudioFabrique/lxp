import { type Response, type NextFunction } from "express";
import { badQuery } from "../utils/constantes.ts";
import jwt from "jsonwebtoken";

import BlackListedToken from "../utils/interfaces/db/blacklisted-token.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import { buildAbility } from "../utils/rbac/ability.ts";
import { env } from "../config/env.ts";

export default function activateAccount(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const message = "Ce lien n'est plus valide.";
    const { token, password } = req.body;

    if (!token) throw { statusCode: 400, message: "Un token est requis" };
    jwt.verify(
      token.toString(),
      env.REGISTER_SECRET,
      async (err: any, data: any) => {
        if (err) {
          // Send error response directly
          return res.status(401).json({ message });
        }

        if (data) {
          const existingBlacklistedToken = await BlackListedToken.findOne({
            token,
          });
          if (existingBlacklistedToken) {
            return res.status(400).json({ message });
          }
          const ability = buildAbility([]);
          req.auth = {
            userId: data.userId,
            userRoles: data.userRoles,
            ability,
            abilityRules: ability.rules,
          };
        }
        next();
      }
    );
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
