import { Response } from "express";

import updateParcoursInfos from "../../models/parcours/update-parcours-infos";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../utils/constantes";
import { logger } from "../../utils/logs/logger";

async function httpUpdateParcoursInfos(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw { message: noAccess, status: 403 };
    }
    const { parcoursId, title, description, formation } = req.body;

    const response = await updateParcoursInfos(
      parseInt(parcoursId),
      title,
      description,
      +formation,
      userId
    );
    if (response) {
      return res
        .status(201)
        .json({ message: "Informations du parcours mises à jour" });
    }
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

export default httpUpdateParcoursInfos;
