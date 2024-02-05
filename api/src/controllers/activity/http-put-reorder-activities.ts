import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import updateReorderActrivities from "../../models/activity/update-reorder-activities";

export default async function httpPutReorderActivities(
  req: Request,
  res: Response
) {
  try {
    const { lessonId } = req.params;
    const activitiesIds = req.body;

    const response = await updateReorderActrivities(+lessonId, activitiesIds);
    return res.status(200).json({
      success: true,
      message: "L'ordre des activités a bien été modifié.",
      response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
