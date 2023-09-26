import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery, serverIssue } from "../../utils/constantes";
import deleteBonusSkill from "../../models/bonus-skill/delete-bonus-skill";

async function httpDeleteBonusSkill(req: Request, res: Response) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: badQuery });
    }

    const { id } = req.params;

    const response = await deleteBonusSkill(parseInt(id));

    return res.status(201).json({ success: true, response });
  } catch (error: any) {
    console.log({ error });

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpDeleteBonusSkill;
