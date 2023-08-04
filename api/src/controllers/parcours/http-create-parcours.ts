import { Response } from "express";
import { badQuery, noAccess, serverIssue } from "../../utils/constantes";
import createParcours from "../../models/parcours/create-parcours";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { validationResult } from "express-validator";

async function httpCreateParcours(req: CustomRequest, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  console.log(req.body);

  try {
    /*     if (
      !req.auth ||
      req.auth === undefined ||
      !req.auth.userId ||
      req.auth.userId === undefined
    ) {
      return res.status(403).json({ message: noAccess });
    }

    const userId = req.auth.userId; */
    const parcours = req.body;

    const result = await createParcours(parcours);
    if (result) {
      return res.status(201).json({
        message: "Parcours enregistré avec succès!",
        parcoursId: result.id,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpCreateParcours;
