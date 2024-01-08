import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { badQuery, serverIssue } from "../../utils/constantes";
import putReorderObjectives from "../../models/parcours/put-reorder-objectives";

async function httpPutReorderObjectives(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(403).json({ message: badQuery });
  }

  try {
    const { parcoursId, objectivesId } = req.body;
    const response = await putReorderObjectives(parcoursId, objectivesId);
    console.log({ response });

    return res.status(201).json({
      success: true,
      data: response,
      message: "Liste des objectifs re-arrangée",
    });
  } catch (error: any) {
    return res
      .status(error.status ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutReorderObjectives;
