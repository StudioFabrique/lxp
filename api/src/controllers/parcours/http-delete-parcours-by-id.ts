import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import deleteParcoursById from "../../models/parcours/delete-parcours-by-id";

async function httpDeleteParcoursById(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { parcoursId } = req.params;
    const response = await deleteParcoursById(parseInt(parcoursId));
    return res.status(201).json({
      message: `Le parcours identifié par l'id : ${parcoursId} a bien été supprimé`,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpDeleteParcoursById;
