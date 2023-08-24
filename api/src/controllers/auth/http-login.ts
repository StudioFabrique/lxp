import { Request, Response } from "express";
import {
  badQuery,
  credentialsError,
  regexPassword,
  serverIssue,
} from "../../utils/constantes";
import userLogin from "../../models/auth/user-login";
import { setTokens } from "../../utils/services/auth/set-tokens";
import { tokensMaxAge } from "../../config/config";
import { validationResult } from "express-validator";
import { logger } from "../../utils/logs/logger";

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

    if (user) {
      const accessToken = setTokens(user.id, user.roles);
      const refreshToken = setTokens(user.id, user.roles);
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
        .json(user);
    }
    throw { message: credentialsError, status: 401 };
  } catch (error: any) {
    return res
      .status(error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpLogin;
