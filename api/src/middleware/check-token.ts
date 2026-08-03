import { type Response, type NextFunction } from "express";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import { noAccess } from "../utils/constantes.ts";
import {
  authenticateSession,
  AuthenticationError,
} from "../utils/services/auth/authenticate-session.ts";

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
