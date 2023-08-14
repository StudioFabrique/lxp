import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery } from "../../utils/constantes";
import getParcoursById from "../../models/parcours/get-parcours-by-id";

async function httpGetParcoursById(req: Request, res: Response) {
  // TODO: vérifier le propriétaire du parcours

  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }
    const { parcoursId } = req.params;
    const response = await getParcoursById(parseInt(parcoursId));
    if (response) {
      return res.status(200).json(response);
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetParcoursById;
