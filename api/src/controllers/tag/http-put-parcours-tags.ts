import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import putParcoursTags from "../../models/tag/put-parcours-tags";

async function httpPutParcoursTags(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  const { parcoursId, tags } = req.body;

  try {
    const response = await putParcoursTags(parseInt(parcoursId), tags);
    return res
      .status(201)
      .json({ success: true, message: "Tags mis à jour avec succès" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpPutParcoursTags;
