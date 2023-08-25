import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomRequest from "../utils/interfaces/express/custom-request";
import { noAccess } from "../utils/constantes";
import { hasRole } from "../utils/services/permissions/hasRole";

function isStudent(req: CustomRequest, res: Response, next: NextFunction) {
  const authCookie = req.cookies.accessToken;

  jwt.verify(authCookie, process.env.SECRET!, (err: any, data: any) => {
    if (err) {
      console.log("token expiré!");
      return res.status(403).json({ message: noAccess });
    } else if (data.userRoles[0].rank < 3) {
      req.auth = { userId: data.userId, userRoles: data.userRoles };
      console.log("coucou je check le token:", req.auth);
      next();
    } else {
      return res
        .status(403)
        .json({
          message: "Vous n'êtes pas autorisé à accéder à cette ressource",
        });
    }
  });
}

export default isStudent;
