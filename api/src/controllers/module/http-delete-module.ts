import { Response, NextFunction } from "express";

import deleteModule from "../../models/module/delete-module";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { serverIssue } from "../../utils/constantes";

async function httpDeleteModule(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const { moduleId } = req.params;
  const userId = req.auth?.userId;

  try {
    await deleteModule(+moduleId, userId!);
    next({
      statusCode: 200,
      data: { success: true, message: "Module supprimé avec succès" },
    });
  } catch (error: any) {
    console.log({ error });

    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}

export default httpDeleteModule;
