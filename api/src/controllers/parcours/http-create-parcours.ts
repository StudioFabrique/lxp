import { type Response } from "express";

import { noAccess, serverIssue } from "../../utils/constantes.ts";
import createParcours from "../../models/parcours/create-parcours.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { customEscape } from "../../helpers/custom-escape.ts";

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
    console.log(error.message);

    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpCreateParcours;
