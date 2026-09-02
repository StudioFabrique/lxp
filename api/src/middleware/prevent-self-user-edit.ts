import { type NextFunction, type Response } from "express";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

/** La fiche personnelle se modifie depuis le profil, pas depuis l'administration. */
export default function preventSelfUserEdit(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.auth?.userId === req.params.id) {
    return res.status(403).json({
      message: "Votre propre compte ne peut pas être modifié depuis cette liste.",
    });
  }
  next();
}
