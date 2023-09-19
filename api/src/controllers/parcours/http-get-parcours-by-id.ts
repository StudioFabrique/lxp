import { Response } from "express";

import getParcoursById from "../../models/parcours/get-parcours-by-id";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../utils/constantes";

async function httpGetParcoursById(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }

    const { parcoursId } = req.params;
    const response = await getParcoursById(+parcoursId, userId);
    if (response) {
      return res.status(200).json(response);
    }
  } catch (error: any) {
    let returnedError: any;

    if (error.status === 403) {
      returnedError = { ...error, from: req.socket.remoteAddress };
    } else {
      returnedError = error;
    }

    return res
      .status(returnedError.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetParcoursById;
