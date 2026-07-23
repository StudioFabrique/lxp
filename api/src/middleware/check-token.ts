import { Response, NextFunction } from "express";
import CustomRequest from "../utils/interfaces/express/custom-request";
import { noAccess } from "../utils/constantes";
import {
  authenticateSession,
  AuthenticationError,
} from "../utils/services/auth/authenticate-session";

async function checkToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    req.auth = await authenticateSession(req.cookies.accessToken, "access");
    res.locals.roles = req.auth.userRoles;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(401).json({ message: noAccess });
    }
    next(error);
  }
}

export default checkToken;
