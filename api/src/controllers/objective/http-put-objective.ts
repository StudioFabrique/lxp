import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery, serverIssue } from "../../utils/constantes";
import putObjective from "../../models/objective/put-objective";

async function httpPutObjective(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const objective = req.body;

    const response = await putObjective(objective);
    return res.status(201).json({
      success: true,
      message: "L'objectif de parcours a été mis à jour",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutObjective;
