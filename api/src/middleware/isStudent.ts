import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomRequest from "../utils/interfaces/express/custom-request";
import { noAccess } from "../utils/constantes";

function isStudent(req: CustomRequest, res: Response, next: NextFunction) {
  const authCookie = req.cookies.accessToken;

  jwt.verify(authCookie, process.env.SECRET!, (err: any, data: any) => {
    if (err) {
      console.log("token expiré!");
      return res.status(403).json({ message: noAccess });
    } else if (data && data.userRoles.includes("student")) {
      req.auth = { userId: data.userId, userRole: data.userRole };
      console.log("coucou je check le token:", req.auth);
      next();
    } else {
      return res.status(403).json({ message: "you're not a student" });
    }
  });
}

export default isStudent;
