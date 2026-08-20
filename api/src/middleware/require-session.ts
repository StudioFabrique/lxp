import { type Response, type NextFunction, type Request } from "express";
import { noAccess } from "../utils/constantes.ts";
import {
  AuthenticationError,
  verifySessionToken,
} from "../utils/services/auth/authenticate-session.ts";

/**
 * Exige une session ouverte, sans résoudre les permissions.
 *
 * Utilisé devant les fichiers statiques d'`uploads/activities` : le contrôle
 * fin d'accès au contenu se joue sur les routes `/v1` qui distribuent les URLs,
 * ici il s'agit seulement d'empêcher qu'un fichier soit téléchargeable par un
 * visiteur anonyme qui en connaîtrait l'adresse.
 */
export default async function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await verifySessionToken(req.cookies.accessToken, "access");
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(401).json({ message: noAccess });
    }
    next(error);
  }
}
