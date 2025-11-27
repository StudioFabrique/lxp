// Import des dépendances nécessaires
import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postImage from "../../models/activity/post-activity/post-image";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";

/**
 * Contrôleur pour créer une nouvelle activité de type image
 * Gère la création des informations et le téléchargement d'une image
 *
 * Le contrôleur:
 * 1. Extrait les données de la requête (fichier, données du formulaire)
 * 2. Appelle le service de création d'activité
 * 3. Retourne une réponse de succès ou d'erreur
 *
 * @param req - Requête Express personnalisée contenant les données de l'activité et le fichier
 * @param res - Réponse Express
 * @param next - Fonction middleware suivante
 */
export default async function httpPostImage(
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    // Extraction des données de la requête
    const { data } = req.body; // Récupération des données JSON du formulaire
    const file = req.file; // Récupération du fichier uploadé s'il existe
    const userId = req.auth?.userId; // ID de l'utilisateur authentifié
    const { lessonId } = req.params; // ID de la leçon parent

    // Détermine le nom du fichier à utiliser (null si pas de fichier)
    const filename = file ? file.filename : null;

    // Appel au service de création avec tous les paramètres nécessaires
    const response = await postImage(
      +lessonId, // Conversion en nombre
      userId!, // L'utilisateur doit exister à ce stade
      data.title, // Titre de l'activité
      filename ?? null, // Nom du fichier uploadé ou null
      data.url ?? null // URL de l'image si sélectionnée depuis la médiathèque
    );

    // Préparation de la réponse en cas de succès
    const result = {
      statusCode: 201, // Created
      data: {
        success: true,
        message: "Activité créée avec succès.",
        response, // Données de l'activité créée
      },
    };
    next(result);
  } catch (error: any) {
    // En cas d'erreur, suppression du fichier temporaire s'il existe
    // Pour éviter les fichiers orphelins
    if (req.file) await deleteTempUploadedFile(req);

    // Préparation de la réponse d'erreur
    const err = {
      statusCode: error.statusCode ?? 500, // 500 par défaut si pas de code spécifique
      message: error.message, // Message d'erreur
    };
    next(err);
  }
}
