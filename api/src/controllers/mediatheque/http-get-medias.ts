// Import des types Express nécessaires pour le controller
import { Request, Response, NextFunction } from "express";
// Import de la fonction qui récupère les images depuis la base de données
import getMediaImages from "../../models/mediatheque/get-medias";

/**
 * Controller qui gère la récupération des images de la médiathèque
 * @param req - La requête Express
 * @param res - La réponse Express
 * @param next - Fonction middleware suivante
 */
export default async function httpGetMedias(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Récupération des images depuis la base de données
    const response = await getMediaImages(req);

    // Envoi de la réponse avec les images récupérées
    next({
      statusCode: 200,
      data: { success: true, ...response },
    });
  } catch (error: any) {
    // En cas d'erreur, on renvoie une erreur 500 avec le message d'erreur
    next({ statusCode: 500, message: error.message });
  }
}
