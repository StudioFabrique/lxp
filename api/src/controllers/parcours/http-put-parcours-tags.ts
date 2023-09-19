import { Response } from "express";

import putParcoursTags from "../../models/parcours/put-parcours-tags";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../utils/constantes";
import { logger } from "../../utils/logs/logger";

async function httpPutParcoursTags(req: CustomRequest, res: Response) {
  const userId = req.auth?.userId;

  if (!userId) {
    throw { message: noAccess, status: 403 };
  }

  const { parcoursId, tags } = req.body;

  try {
    const response = await putParcoursTags(+parcoursId, tags, userId);
    return res
      .status(201)
      .json({ success: true, message: "Tags mis à jour avec succès" });
  } catch (error: any) {
    let returnedError = error;
    if (error.status === 403) {
      returnedError = { ...returnedError, from: req.socket.remoteAddress };
      logger.error(returnedError);
    }
    return res
      .status(returnedError.status ?? 500)
      .json({ message: returnedError.message ?? serverIssue });
  }
}

export default httpPutParcoursTags;
