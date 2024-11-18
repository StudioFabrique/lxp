import { Response } from "express";

import { noAccess, serverIssue } from "../../utils/constantes";
import deleteParcoursById from "../../models/parcours/delete-parcours-by-id";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { logger } from "../../utils/logs/logger";

async function httpDeleteParcoursById(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }
    const { parcoursId } = req.params;
    const result = await deleteParcoursById(+parcoursId, userId);
    return res.status(200).json({
      message: `Le parcours ${result} a bien été supprimé`,
      success: true,
    });
  } catch (error: any) {
    let returnedError = error;
    if (error.statusCode === 403) {
      returnedError = { ...returnedError, from: req.socket.remoteAddress };
      logger.error(returnedError);
    }
    return res
      .status(returnedError.statusCode ?? 500)
      .json({ message: returnedError.message ?? serverIssue });
  }
}

export default httpDeleteParcoursById;
