import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import putBonusSkill from "../../models/bonus-skill/put-bonus-skill";

async function httpPutBonusSkill(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(403).json({ message: badQuery });
  }

  try {
    const { skill } = req.body;
    console.log({ skill });

    await putBonusSkill(skill);
    return res
      .status(201)
      .json({ success: true, message: "La compétence a été mise à jour" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default httpPutBonusSkill;
