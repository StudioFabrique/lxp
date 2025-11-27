import { Response, NextFunction } from "express";

import CustomRequest from "../../utils/interfaces/express/custom-request";
import enableCourse from "../../models/course/enable-course";

export async function httpEnableCourse(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    //  récupération de l'identifiant du cours à supprimer dans les paramètres d'url
    const { courseId } = req.params;
    const { visibility } = req.query;

    //  appel de la fonction qui supprime le cours et ses ressources associés
    //  l'identifiant du cours est converti en type number
    await enableCourse(+courseId, Boolean(visibility === "true"));
    //  retourne une réponse positive
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Le statut de visibilité du cours a bien été mis à jour",
      },
    };
    next(result);
  } catch (error: any) {
    //  gestion d'une éventuelle erreur
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
