import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery, noData, serverIssue } from "../../utils/constantes";
import getParcoursByFormation from "../../models/parcours/get-parcours-by-formation";

async function httpGetParcoursByFormation(req: Request, res: Response) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }
    const { formationId } = req.params;
    const response = await getParcoursByFormation(parseInt(formationId));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetParcoursByFormation;
