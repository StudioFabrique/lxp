import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery, serverIssue } from "../../utils/constantes";
import putParcoursObjectives from "../../models/parcours/put-parcours-objectives";

async function httpPutParcoursObjectives(req: Request, res: Response) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const { parcoursId, objectives } = req.body;

    console.log(req.body);

    const response = await putParcoursObjectives(parcoursId, objectives);
    console.log(response);
    return res.status(201).json({
      success: true,
      data: response,
      message: "La liste des objectifs du parcours a été mise à jour",
    });
  } catch (error: any) {
    return res
      .status(error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutParcoursObjectives;
