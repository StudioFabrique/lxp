import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postActivityResource from "../../models/activity/post-activity/post-resource";
import fs from "fs";

/**
 * Contrôleur pour gérer l'upload de ressources (fichiers) liées à une activité
 * @param req Requête Express personnalisée contenant les fichiers et données
 * @param res Réponse Express
 * @param next Fonction suivante dans le middleware
 */
export default async function httpPostActivityResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    // Appel au service pour sauvegarder les ressources
    const response = await postActivityResource(req);

    // Préparation de la réponse avec statut 201 (Created)
    const result = {
      statusCode: 201,
      data: {
        success: true,
        message: `Ressources téléversées avec succès (${response.result.count}).`,
      },
    };
    next(result);
  } catch (error: any) {
    console.log({ error });

    // En cas d'erreur, on nettoie les fichiers qui ont été uploadés
    if (req.files) {
      // Gestion des fichiers qu'ils soient dans un tableau ou un objet
      const files = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files);

      // Suppression physique de chaque fichier
      for (const file of files as Express.Multer.File[]) {
        fs.unlinkSync(file.path);
      }
    }

    // Construction de l'erreur avec code HTTP approprié
    const err = {
      statusCode: error.statusCode ?? 500, // 500 par défaut si pas de code spécifique
      message: error.message,
    };
    next(err);
  }
}
