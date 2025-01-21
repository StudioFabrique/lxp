import { Request, Response, NextFunction } from "express";
import getParcoursSkillsContacts from "../../models/parcours/get-parcours-skills-contacts";

/**
 * Contrôleur HTTP pour récupérer les contacts et compétences associés à un parcours
 * @param req Requête Express contenant l'ID du parcours dans les paramètres
 * @param res Réponse Express
 * @param next Fonction middleware suivante
 */
export default async function httpGetParcoursSkillsContacts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extraction de l'ID du parcours depuis les paramètres de la requête
    const { parcoursId } = req.params;

    // Appel au modèle pour récupérer les données
    const response = await getParcoursSkillsContacts(+parcoursId);

    // Transmission de la réponse au middleware suivant en cas de succès
    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Contacts et compétences récupérées avec succès.",
        contacts: response.contacts,
        skills: response.skills,
      },
    });
  } catch (error: any) {
    // Gestion des erreurs avec transmission au middleware d'erreur
    next({
      statusCode: error.statusCode ?? 500,
      message:
        error.message ??
        "Une erreur est survenue lors de la récupération des compétences et contacts du parcours.",
    });
  }
}
