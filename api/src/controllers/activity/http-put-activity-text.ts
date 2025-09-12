import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import updateText from "../../models/activity/update-activity/put-activity-text";

/**
 * Controller pour mettre à jour le texte d'une activité
 * @param req - Requête Express contenant l'ID de l'activité et les nouvelles données
 * @param res - Réponse Express
 * @returns Réponse JSON avec statut de succès et message
 */
export default async function httpPutActivityText(req: Request, res: Response) {
  try {
    // Récupération de l'ID de l'activité depuis les paramètres de l'URL
    const { id } = req.params;
    // Récupération des données à mettre à jour depuis le corps de la requête
    const { value, title, description, parent } = req.body;

    console.log({ parent });

    // Appel au modèle pour effectuer la mise à jour
    const response = await updateText(+id, value, title, description, parent);

    // Retourne une réponse de succès
    return res.status(200).json({
      success: true,
      message: "Document mis à jour avec succès",
      response,
    });
  } catch (error: any) {
    // En cas d'erreur, retourne le code d'erreur approprié ou 500 par défaut
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
