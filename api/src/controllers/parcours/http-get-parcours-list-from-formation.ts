import { Request, Response, NextFunction } from "express";
import getParcoursListFromFormation from "../../models/parcours/get-parcours-list-from-formation";

/**
 * Récupère la liste des parcours associés à une formation
 * @param req Requête HTTP
 * @param res Réponse HTTP
 * @param next Fonction de callback pour la gestion des erreurs
 */
export default async function httpGetParcoursListFromFormation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const formationId = +req.params.formationId;
    const parcours = await getParcoursListFromFormation(formationId);
    next({
      statusCode: 200,
      success: true,
      message: "Liste des parcours récupérée.",
      data: parcours,
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message,
    });
  }
}
