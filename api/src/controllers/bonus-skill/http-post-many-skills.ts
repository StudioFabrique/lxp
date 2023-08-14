import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import postManySkills from "../../models/bonus-skill/post-many-skills";
import { customEscape } from "../../helpers/custom-escape";

async function httpPostManySkills(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    let { parcoursId, skills } = req.body;

    if (skills && skills.length > 0) {
      skills = skills.map((item: any) => ({
        ...item,
        description: customEscape(item.description),
      }));
    }

    const response = await postManySkills(parseInt(parcoursId), skills);
    return res.status(201).json({ success: true, skills: response });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpPostManySkills;
