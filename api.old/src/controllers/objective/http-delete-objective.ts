import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery, serverIssue } from "../../utils/constantes";
import deleteObjective from "../../models/objective/delete-objective";

async function httpDeleteObjective(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { objectiveId } = req.params;
    const response = await deleteObjective(objectiveId);
    return res.status(201).json({
      success: true,
      message: "L'objectif de parcours a bien été supprimé",
      id: response,
    });
  } catch (error: any) {
    return res
      .status(error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpDeleteObjective;
