import { type Response } from "express";
import deleteFormationModule from "../../models/module/delete-formation-module.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpDeleteFormationModule(
  req: CustomRequest,
  res: Response,
) {
  try {
    const { moduleId } = req.params;

    // Récupération de l'ID utilisateur (à adapter selon votre middleware d'auth, ex: req.user.id)
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    await deleteFormationModule(userId, +moduleId);

    return res.status(200).json({ message: "Module supprimé avec succès" });
  } catch (error: any) {
    // On utilise le code d'erreur personnalisé s'il existe, sinon un 500
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || "Le module n'a pas pu être effacé.",
    });
  }
}
