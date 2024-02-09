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
      // on rafraîchit la date de la derniere connexion de l'utilisateur pour avoir une durée de connexion la plus précise possible
      const user = await User.findOne({ _id: data.userId }).populate("roles");
      if (user && user.roles[0].rank > 2) {
        const connInfos = await ConnectionInfos.findOne({
          _id: user.connectionInfos![user.connectionInfos!.length - 1],
        });
        if (connInfos) {
          const now = new Date().getTime();
          const duration =
            connInfos.totalConnTime +
            (now - connInfos!.lastConnection.getTime());
          await ConnectionInfos.findOneAndUpdate(
            { _id: connInfos._id },
            { totalConnTime: duration },
            { new: true }
          );
          const date = connInfos?.lastConnection;
          const today = new Date();

          if (
            connInfos &&
            connInfos.lastConnection.getDate() === new Date().getDate() &&
            connInfos.lastConnection.getMonth() === new Date().getMonth() &&
            connInfos.lastConnection.getFullYear() === new Date().getFullYear()
          ) {
            // If existing connectionInfos is created today, update lastConnection
            await ConnectionInfos.findOneAndUpdate(
              { _id: connInfos._id },
              { lastConnection: new Date() },
              { new: true }
            );
          } else {
            const newInfos = new IConnectionInfos({});
            const tmp = [...user.connectionInfos, new Object(newInfos._id)];
            await User.findOneAndUpdate(
              { _id: user._id },
              { connectionInfos: tmp }
            );
          }
        }
      }
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
