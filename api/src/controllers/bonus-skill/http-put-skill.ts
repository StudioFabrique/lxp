import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import putBonusSkill from "../../models/bonus-skill/put-bonus-skill";

async function httpPutBonusSkill(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { skill } = req.body;
    const response = await putBonusSkill(skill);
    return res
      .status(201)
      .json({
        success: true,
        message: "La compétence a été mise à jour",
        updatedSkill: response,
      });
  } catch (error: any) {
    console.log("ERROR :", error);

    return res.status(500).json({ success: false, message: error.message });
  }
}

export default httpPutBonusSkill;
