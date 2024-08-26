import { Request, Response, NextFunction } from "express";
import deleteCourse from "../../models/course/delete-course-from-module";

export async function httpDeleteCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    //  récupération de l'identifiant du cours à supprimer dans les paramètres d'url
    const { courseId } = req.params;
    //  appel de la fonction qui supprime le cours et ses ressources associés
    //  l'identifiant du cours est converti en type number
    await deleteCourse(+courseId);
    //  retourne une réponse positive
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Le cours et ses ressources ont été suprimés avec succès.",
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
