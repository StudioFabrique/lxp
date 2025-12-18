import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomRequest from "../utils/interfaces/express/custom-request";
import { noAccess } from "../utils/constantes";
import {
  isTokenBlacklisted,
  letsBlackListAToken,
  setTokens,
} from "../utils/services/auth/set-tokens";
import { accessExpire, refreshExpire, tokensMaxAge } from "../config/config";
import BlackListedToken from "../utils/interfaces/db/blacklisted-token";

async function refreshTokens(
  req: CustomRequest,
  res: Response,
  _next: NextFunction,
) {
  const authCookie = req.cookies.refreshToken;

  if (await isTokenBlacklisted(authCookie)) {
    return res.status(403).json({ message: noAccess });
  }

  jwt.verify(authCookie, process.env.SECRET!, async (err: any, data: any) => {
    if (err) {
      await letsBlackListAToken(authCookie);
      return res.status(403).json({ message: noAccess });
    } else {
      const accessToken = setTokens(data.userId, data.userRoles, accessExpire);
      const refreshToken = setTokens(
        data.userId,
        data.userRoles,
        refreshExpire,
      );
      return res
        .cookie("accessToken", accessToken, {
          maxAge: tokensMaxAge.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
        })
        .cookie("refreshToken", refreshToken, {
          maxAge: tokensMaxAge.refreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
        })
        .status(200)
        .json({ message: "tokens refreshed successfully!" });
    }
  });
}

export default refreshTokens;
