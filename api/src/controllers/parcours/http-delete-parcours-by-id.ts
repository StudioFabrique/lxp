import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery, serverIssue } from "../../utils/constantes";
import deleteParcoursById from "../../models/parcours/delete-parcours-by-id";

async function httpDeleteParcoursById(req: Request, res: Response) {
  try {
    const { parcoursId } = req.params;
    await deleteParcoursById(+parcoursId);
    return res.status(201).json({
      message: `Le parcours identifié par l'id : ${parcoursId} a bien été supprimé`,
    });
  } catch (error: any) {
    return res
      .status(error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpDeleteParcoursById;
