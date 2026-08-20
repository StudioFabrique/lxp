// Import des types Express nécessaires
import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";
// Import de la fonction du modèle pour récupérer la liste des leçons
import getLessonsList from "../../models/lesson/get-lessons-list.ts";

/**
 * Contrôleur HTTP pour récupérer la liste de toutes les leçons
 * @param req - Requête Express
 * @param res - Réponse Express
 * @returns Réponse JSON contenant la liste des leçons ou un message d'erreur
 */
export default async function httpGetLessonsList(
  req: CustomRequest,
  res: Response,
) {
  try {
    // Récupération de la liste des leçons via le modèle, bornée au périmètre
    // de l'appelant.
    const response = await getLessonsList(await resolveAccessScope(req.auth!));

    // Retourne une réponse réussie avec les données
    return res.status(200).json({
      success: true,
      message:
        response.length === 0 ? "Aucune leçons trouvées" : "Liste téléchargée",
      lessons: response,
    });
  } catch (error: any) {
    // En cas d'erreur, retourne un statut 500 avec le message d'erreur
    return res.status(500).json({ message: error.message });
  }
}
