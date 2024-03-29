import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery, serverIssue } from "../../utils/constantes";
import putFormationTags from "../../models/formation/put-formation-tags";

async function httpPutFormationTags(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  const { formationId, tags } = req.body;

  try {
    const response = await putFormationTags(parseInt(formationId), tags);
    return res
      .status(200)
      .json({ success: true, message: "Tags mis à jour avec succes" });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutFormationTags;
