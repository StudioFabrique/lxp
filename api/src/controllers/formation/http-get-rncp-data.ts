import { Request, Response, NextFunction } from "express";
import getRncpData from "../../models/formation/get-rncp-data";

/**
 * Contrôleur pour récupérer les données RNCP d'une certification
 * @param req - Requête Express contenant le code RNCP dans les paramètres
 * @param res - Réponse Express
 * @param next - Fonction suivante dans le middleware
 */
export default async function httpGetRncpData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Récupération du code RNCP depuis les paramètres de la requête
    const rncp = req.params.rncp;

    // Appel au modèle pour récupérer les données RNCP
    const response = await getRncpData(rncp);

    // Envoi de la réponse avec succès
    next({
      statusCode: 200,
      data: {
        success: true,
        response,
      },
    });
  } catch (error: any) {
    // En cas d'erreur, transmission au gestionnaire d'erreurs
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message,
    });
  }
}
