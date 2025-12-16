import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import CustomRequest from "../utils/interfaces/express/custom-request";
import { noAccess } from "../utils/constantes";
import { hasRole } from "../utils/services/permissions/hasRole";
import BlackListedToken from "../utils/interfaces/db/blacklisted-token";

function checkToken(req: CustomRequest, res: Response, next: NextFunction) {
  const authCookie = req.cookies.accessToken;
  jwt.verify(authCookie, process.env.SECRET!, async (err: any, data: any) => {
    if (err) {
      try {
        await BlackListedToken.create({
          token: authCookie,
        });
      } catch (error) {
        console.error("Error creating blacklisted token:", error);
      }
      return res.status(403).json({ message: noAccess });
    } else if (
      data &&
      (hasRole(1, data.userRoles) ||
        hasRole(2, data.userRoles) ||
        hasRole(3, data.userRoles))
    ) {
      req.auth = { userId: data.userId, userRoles: data.userRoles };
      next();
    } else {
      return res.status(403).json({ message: "you're not a student" });
    }
  });
}

export default checkToken;
