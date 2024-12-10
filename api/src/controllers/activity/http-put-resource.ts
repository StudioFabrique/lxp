import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import putResource from "../../models/activity/update-activity/put-resource";

/**
 * Contrôleur HTTP pour la mise à jour d'une ressource d'activité
 * @param req - Requête Express personnalisée contenant les données de la ressource à mettre à jour
 * @param res - Réponse Express
 * @param next - Fonction middleware suivante
 */
export default async function httpPutResource(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Appel au modèle pour mettre à jour la ressource
    const response = await putResource(req);

    // Envoi de la réponse en cas de succès
    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Ressource mise à jour avec succès",
        data: response,
      },
    });
  } catch (error: any) {
    // Gestion des erreurs avec le code d'état approprié
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message,
    });
  }
}
