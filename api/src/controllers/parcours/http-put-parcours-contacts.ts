import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import putParcoursContacts from "../../models/parcours/put-parcours-contacts";

async function httpPutParcoursContacts(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { parcoursId, contacts } = req.body;
    await putParcoursContacts(parseInt(parcoursId), contacts);
    return res
      .status(201)
      .json({ success: true, message: "Contacts mis à jour avec succès" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpPutParcoursContacts;
