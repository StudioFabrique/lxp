import { type Response } from "express";

import patchParcours from "../../models/parcours/patch-parcours.ts";
import { noAccess, serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpPatchParcours(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw { message: noAccess, statusCode: 403 };

    const parcours = await patchParcours(
      Number(req.params.parcoursId),
      req.body,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Le parcours a été mis à jour",
      parcours,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPatchParcours;
