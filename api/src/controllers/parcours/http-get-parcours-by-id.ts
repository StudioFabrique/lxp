import { type Response } from "express";

import getParcoursById from "../../models/parcours/get-parcours-by-id.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { noAccess, serverIssue } from "../../utils/constantes.ts";

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
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpGetParcoursById;
