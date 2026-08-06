import { type Response, type NextFunction } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import putActivityImage from "../../models/activity/update-activity/put-activity-image.ts";
import { deleteTempUploadedFile } from "../../middleware/fileUpload.ts";

/**
 * Contrôleur pour mettre à jour une activité de type image
 * Gère la mise à jour des informations et le téléchargement d'une nouvelle image
 *
 * @param req - Requête Express personnalisée contenant les données de l'activité et le fichier
 * @param res - Réponse Express
 * @param next - Fonction middleware suivante
 */
export default async function httpPutImage(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    // Extraction des données de la requête
    const { data } = req.body;
    const file = req.file;
    const userId = req.auth?.userId;
    const { activityId, parent } = req.params as {
      activityId: string;
      parent: "lesson" | "resource" | undefined;
    };

    // Gestion du nom du fichier s'il y en a un
    let filename: string | null = null;
    if (file) filename = file.filename;

    // Appel au service de mise à jour
    const response = await putActivityImage(
      +activityId,
      userId ?? "",
      data.title,
      data.description,
      filename,
      data.url,
      parent,
    );

    // Préparation de la réponse en cas de succès
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Activité mise à jour avec succès.",
        response,
      },
    };
    next(result);
  } catch (error: any) {
    // En cas d'erreur, suppression du fichier temporaire s'il existe
    if (req.file) await deleteTempUploadedFile(req);

    // Préparation de la réponse d'erreur
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
