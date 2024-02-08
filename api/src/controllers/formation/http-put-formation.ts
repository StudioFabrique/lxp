import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putFormation from "../../models/formation/put-formation";

export default async function httpPutFormation(req: Request, res: Response) {
  try {
    const { formationId } = req.params;
    const { formation } = req.body;
    const response = await putFormation(+formationId, formation);
    return res
      .status(200)
      .json({
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
