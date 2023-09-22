import { Request, Response } from "express";
import { validationResult } from "express-validator";

import putParcoursSkill from "../../models/parcours/put-parcours-bonus-skill";
import { badQuery } from "../../utils/constantes";

async function httpPutParcoursSkill(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { parcoursId, skill } = req.body;
    const response = await putParcoursSkill(parseInt(parcoursId), skill);
    return res.status(201).json({ success: true, skills: response });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpPutParcoursSkill;
