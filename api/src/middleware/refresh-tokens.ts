import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomRequest from "../utils/interfaces/express/custom-request";
import { noAccess } from "../utils/constantes";
import { setTokens } from "../utils/services/auth/set-tokens";
import { tokensMaxAge } from "../config/config";
import User from "../utils/interfaces/db/user";
import ConnectionInfos from "../utils/interfaces/db/connection-infos";
import IConnectionInfos from "../utils/interfaces/db/connection-infos";

function refreshTokens(req: CustomRequest, res: Response, next: NextFunction) {
  const authCookie = req.cookies.refreshToken;

  jwt.verify(authCookie, process.env.SECRET!, async (err: any, data: any) => {
    if (err) {
      return res.status(403).json({ message: noAccess });
    } else {
      const accessToken = setTokens(data.userId, data.userRoles);
      const refreshToken = setTokens(data.userId, data.userRoles);
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
