import { Response, NextFunction } from "express";
import { badQuery } from "../utils/constantes";
import jwt from "jsonwebtoken";

import BlackListedToken from "../utils/interfaces/db/blacklisted-token";
import CustomRequest from "../utils/interfaces/express/custom-request";

export default function activateAccount(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const message = "Ce lien n'est plus valide.";
    const { token } = req.body;
    if (!token) throw { satusCode: 400, message: badQuery };
    jwt.verify(
      token,
      process.env.REGISTER_SECRET!,
      async (err: any, data: any) => {
        if (err) throw { statusCode: 401, message };
        if (data) {
          const existingBlacklistedToken = await BlackListedToken.findOne({
            token,
          });
          if (existingBlacklistedToken)
            return res.status(400).json({ message });
          req.auth = { userId: data.userId, userRoles: data.userRoles };
        }
        next();
      },
    );
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
