import { Response } from "express";

import { noAccess, serverIssue } from "../../utils/constantes";
import putVirtualClass from "../../models/parcours/put-virtual-class";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { logger } from "../../utils/logs/logger";
import { customEscape } from "../../helpers/custom-escape";

async function httpPutVirtualClass(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }

    const { parcoursId, virtualClass } = req.body;

    const response = await putVirtualClass(
      parcoursId,
      customEscape(virtualClass),
      userId
    );
    console.log({ response });

    if (!response) {
      console.log("oops");
    }

    return res.status(201).json({
      success: true,
      message: "Le lien vers la classe virtuelle a été mis à jour",
    });
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

export default httpPutVirtualClass;
