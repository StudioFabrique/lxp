import { Response } from "express";
import deleteFormation from "../../models/formation/delete-formation";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";

export default async function httpDeleteFormation(
  req: CustomRequest,
  res: Response,
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const title = await deleteFormation(Number(req.params.formationId));
    return res.status(200).json({
      success: true,
      message: `La formation ${title} a été supprimée avec succès.`,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.message ?? serverIssue,
    });
  }
}
