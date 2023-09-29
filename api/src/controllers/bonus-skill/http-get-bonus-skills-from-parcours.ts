import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery } from "../../utils/constantes";
import getBonusSkillsFromParcours from "../../models/bonus-skill/get-bonus-skills-from-parcours";

async function httpGetBonusSkillsFromParcours(req: Request, res: Response) {
  try {
    const response = await getBonusSkillsFromParcours();
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetBonusSkillsFromParcours;
