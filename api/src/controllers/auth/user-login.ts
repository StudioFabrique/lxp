import { Request, Response } from "express";
import {
  credentialsError,
  regexPassword,
  serverIssue,
} from "../../utils/constantes";
import userLogin from "../../models/auth/user-login";
import { setTokens } from "../../utils/services/auth/setTokens";
import { tokensMaxAge } from "../../config/config";
import { validationResult } from "express-validator";

async function httpUserLogin(req: Request, res: Response) {
  try {
    //  récupération du test de validation
    const result = validationResult(req);

    const { email, password } = req.body;

    //  on vérifie que l'email et le password sont valides
    if (!result.isEmpty() || !password || !regexPassword.test(password)) {
      return res.status(401).json({ message: credentialsError });
    }

    //  on récupére les informations de l'utilisateur si les identifiants sont corrects
    //  et on créé des tokens qu'on retourne sous forme de cookies
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
    return res.status(401).json({ message: credentialsError });
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpUserLogin;
