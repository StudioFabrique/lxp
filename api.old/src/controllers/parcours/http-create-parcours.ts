import { Response } from "express";

import { noAccess, serverIssue } from "../../utils/constantes";
import createParcours from "../../models/parcours/create-parcours";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { customEscape } from "../../helpers/custom-escape";

async function httpCreateParcours(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;
    let parcours = req.body;

    parcours = {
      ...parcours,
      title: customEscape(parcours.title),
      description: customEscape(parcours.description ?? ""),
    };

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }

    const response = await createParcours(parcours, userId);
    return res.status(201).json({
      message: "Parcours enregistré avec succès!",
      parcoursId: response.id,
    });
  } catch (error: any) {
    return res.status(error.status ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpCreateParcours;
