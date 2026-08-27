import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import putActivityTitle from "../../models/activity/update-activity/put-activity-title.ts";

export default async function httpPutActivityTitle(
  req: CustomRequest,
  res: Response,
) {
  try {
    const { activityId, parent } = req.params as {
      activityId: string;
      parent: "lesson" | "resource";
    };
    const { title } = req.body;

    const response = await putActivityTitle(
      Number(activityId),
      title,
      parent,
      req.auth?.userId ?? "",
    );

    return res.status(200).json({
      success: true,
      message: "Titre de l'activité mis à jour.",
      response,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.message ?? "Le titre de l'activité n'a pas pu être mis à jour.",
    });
  }
}
