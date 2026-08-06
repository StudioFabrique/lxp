import { type Response } from "express";

import updateParcoursInfos from "../../models/parcours/update-parcours-infos.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { noAccess, serverIssue } from "../../utils/constantes.ts";

async function httpUpdateParcoursInfos(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw { message: noAccess, status: 403 };
    }
    let { parcoursId, title, description, formation } = req.body;

    await updateParcoursInfos(+parcoursId, title, description, +formation);

    return res
      .status(200)
      .json({ message: "Informations du parcours mises à jour" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpUpdateParcoursInfos;
