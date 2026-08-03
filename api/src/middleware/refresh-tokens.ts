import { type Response, type NextFunction } from "express";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import {
  authenticateSession,
  AuthenticationError,
} from "../utils/services/auth/authenticate-session.ts";
import { setTokens } from "../utils/services/auth/set-tokens.ts";
import { accessExpire, refreshExpire, tokensMaxAge } from "../config/config.ts";
import { noAccess } from "../utils/constantes.ts";

async function refreshTokens(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await authenticateSession(
      req.cookies.refreshToken,
      "refresh",
    );
    const accessToken = setTokens(session.userId, "access", accessExpire);
    const refreshToken = setTokens(session.userId, "refresh", refreshExpire);

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
      .json({ message: "tokens refreshed successfully!" });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(401).json({ message: noAccess });
    }
    next(error);
  }
}

export default refreshTokens;
