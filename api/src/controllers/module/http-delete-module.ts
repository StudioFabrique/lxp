import { type Response, type NextFunction } from "express";

import deleteModule from "../../models/module/delete-module.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { badQuery, serverIssue } from "../../utils/constantes.ts";

async function httpDeleteModule(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const { moduleId } = req.params;
  const userId = req.auth?.userId;

  if (!userId) return res.status(400).json({ message: badQuery });

  try {
    await deleteModule(+moduleId, userId);
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
