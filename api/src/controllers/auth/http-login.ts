import { type Request, type Response } from "express";
import {
  badQuery,
  credentialsError,
  regexPassword,
  serverIssue,
} from "../../utils/constantes.ts";
import userLogin from "../../models/auth/user-login.ts";
import { setTokens } from "../../utils/services/auth/set-tokens.ts";
import {
  accessExpire,
  refreshExpire,
  sessionCookieOptions,
} from "../../config/config.ts";
import { validationResult } from "express-validator";
import { logger } from "../../utils/logs/logger.ts";
import { getAllPermissionsForUser } from "../../utils/rbac/rbac-utils.ts";
import { buildAbility } from "../../utils/rbac/ability.ts";

async function httpLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    //  récupération du test de validation
    const result = validationResult(req);

    //  on vérifie que l'email et le password sont valides
    if (!result.isEmpty() || !password || !regexPassword.test(password)) {
      throw { message: result.array()[0].msg ?? credentialsError, status: 401 };
    }
  } catch (error: any) {
    logger.error(error);
    return res.status(error.status ?? 500).json({
      message: error.message ?? badQuery,
    });
  }

  try {
    /* on récupére les informations de l'utilisateur si les identifiants sont corrects,
    et on créé des tokens qu'on retourne sous forme de cookies */

    const user = await userLogin(email, password);
    const permissions = await getAllPermissionsForUser(user._id);

    if (user) {
      const accessToken = setTokens(user._id, "access", accessExpire);
      const refreshToken = setTokens(user._id, "refresh", refreshExpire);

      /*       if (user.roles[0].rank > 2) {
        await userConnectionNotification(
          user._id,
          `${user.firstname} ${user.lastname} vient de se connecter.`
        );
      } */
      return res
        .cookie("accessToken", accessToken, sessionCookieOptions("accessToken"))
        .cookie(
          "refreshToken",
          refreshToken,
          sessionCookieOptions("refreshToken"),
        )
        .status(200)
        .json({ ...user, abilityRules: buildAbility(permissions).rules });
    }
    const error: any = {
      message: credentialsError,
      status: 401,
    };
    throw error;
  } catch (error: any) {
    if (error.status === 401) {
      const childLogger = logger.child({
        from: req.socket.remoteAddress ?? "unknown",
      });

      childLogger.info(error);
    }
    console.error(error);

    if (error.retryAfterSeconds) {
      res.setHeader("Retry-After", error.retryAfterSeconds);
    }

    return res.status(error.status ?? 500).json({
      code: error.code,
      message: error.message ?? serverIssue,
      retryAfterSeconds: error.retryAfterSeconds,
    });
  }
}

export default httpLogin;
