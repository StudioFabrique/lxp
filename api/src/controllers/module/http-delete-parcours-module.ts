import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { serverIssue } from "../../utils/constantes";
import deleteParcoursModule from "../../models/module/delete-parcours-module";

export default async function httpDeleteParcoursModule(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { moduleId } = req.params;
    const userId = req.auth!.userId;
    await deleteParcoursModule(+moduleId, userId);
    next({
      statusCode: 200,
      data: { success: true, message: "Le module a été supprimé avec succès." },
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
