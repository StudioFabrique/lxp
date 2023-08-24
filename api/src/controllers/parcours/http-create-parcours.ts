import { Response } from "express";
import { badQuery, noAccess, serverIssue } from "../../utils/constantes";
import createParcours from "../../models/parcours/create-parcours";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { validationResult } from "express-validator";
import { logger } from "../../utils/logs/logger";

async function httpCreateParcours(req: CustomRequest, res: Response) {
  try {
    const userId = req.auth?.userId;
    const parcours = req.body;

    if (!userId) {
      throw { message: noAccess, status: 403 };
    }

    const response = await createParcours(parcours, userId);
    return res.status(201).json({
      message: "Parcours enregistré avec succès!",
      parcoursId: response.id,
    });
  } catch (error: any) {
    return res
      .status(error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpCreateParcours;
