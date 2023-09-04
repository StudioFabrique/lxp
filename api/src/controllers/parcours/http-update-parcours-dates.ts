import { Response } from "express";

import { noAccess, serverIssue } from "../../utils/constantes";
import updateParcoursDates from "../../models/parcours/update-parcours-date";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { logger } from "../../utils/logs/logger";

async function httpUpdateParcoursDates(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }
    const { parcoursId, startDate, endDate } = req.body;

    console.log(req.body);

    const response = await updateParcoursDates(
      +parcoursId,
      startDate,
      endDate,
      userId
    );

    if (response) {
      return res.status(201).json({
        success: true,
        message: "Les dates du parcours ont été mises à jour",
      });
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

export default httpUpdateParcoursDates;
