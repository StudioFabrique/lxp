import { Request, Response } from "express";
import { serverIssue } from "../../../utils/constantes";
import updateText from "../../../models/activity/update-activity/update-text";

export default async function httpUpdateActivity(req: Request, res: Response) {
  try {
    const { activityId } = req.params;
    const { value, url, order } = req.body;

    const response = await updateText(+activityId, value, url, order);
    return res.status(200).json({
      success: true,
      message: "Document mis à jour avec succès",
      response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
