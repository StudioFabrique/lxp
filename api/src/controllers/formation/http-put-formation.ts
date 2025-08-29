import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putFormation from "../../models/formation/put-formation";
import { validationResult } from "express-validator";

export default async function httpPutFormation(req: Request, res: Response) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      //console.log("Validation errors:", result.array());

      return res.status(400).json({ errors: result.array() });
    }
    const { formationId } = req.params;
    const { formation } = req.body;
    const response = await putFormation(+formationId, formation);
    return res.status(200).json({
      success: true,
      message: "La formation a été mise à jour.",
      response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
