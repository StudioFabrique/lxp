import { Request, Response, NextFunction } from "express";
import getStudentGroups from "../../models/group/get-student-groups";

/**
 * Contrôleur HTTP pour récupérer la liste des groupes d'étudiants
 * @param req - Requête Express
 * @param res - Réponse Express
 * @param next - Fonction suivante dans le middleware
 */
export default async function httpGetStudentGroups(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    // Appel au modèle pour récupérer les groupes
    const response = await getStudentGroups();

    // Transmission de la réponse au middleware suivant
    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Groupes d'étudiants récupérés avec succès",
        data: response,
      },
    });
  } catch (error: any) {
    console.log({ error });

    // En cas d'erreur, transmission de l'erreur au middleware d'erreur
    next({
      statusCode: error.statusCode ?? 500, // Utilisation du code d'erreur spécifique ou 500 par défaut
      message: error.message,
    });
  }
}
