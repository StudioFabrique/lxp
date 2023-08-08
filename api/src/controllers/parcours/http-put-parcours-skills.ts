import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery } from "../../utils/constantes";
import putParcoursSkills from "../../models/parcours/put-parcours-skills";

async function httpPutParcoursSkills(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { parcoursId, skills } = req.body;
    const response = await putParcoursSkills(parseInt(parcoursId), skills);
    return res.status(201).json({ success: true, skills: response });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpPutParcoursSkills;
