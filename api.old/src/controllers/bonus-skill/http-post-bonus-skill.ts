import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import postBonusSkill from "../../models/bonus-skill/post-bonus-skill";

async function httpPostBonusSkill(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { parcoursId, skill } = req.body;
    const response = await postBonusSkill(parseInt(parcoursId), skill);
    return res.status(201).json({ success: true, skill: response });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpPostBonusSkill;
