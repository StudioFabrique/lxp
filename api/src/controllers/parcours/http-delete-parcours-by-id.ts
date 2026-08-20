import { type Response, type NextFunction } from "express";

import { noAccess, serverIssue } from "../../utils/constantes.ts";
import deleteParcoursById from "../../models/parcours/delete-parcours-by-id.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { logger } from "../../utils/logs/logger.ts";
import { stat } from "fs";

async function httpDeleteParcoursById(
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }
    const { parcoursId } = req.params;

    const response = await deleteParcoursById(+parcoursId, userId);
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: `Le parcours ${response} a été supprimé avec succès.`,
      },
    };
    next(result);
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}

export default httpDeleteParcoursById;
