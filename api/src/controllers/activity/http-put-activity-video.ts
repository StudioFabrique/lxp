import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import putActivityVideo from "../../models/activity/update-activity/put-activity-video.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPutActivityVideo(
  req: CustomRequest,
  res: Response
) {
  try {
    const uploadedFile = req.file;
    const { data } = req.body;
    const { activityId } = req.params;
    const userId = req.auth?.userId;

    if (data.parent !== "lesson" && data.parent !== "resource") {
      return res
        .status(400)
        .json({ message: "Le type de parent spécifié est invalide." });
    }

    const url =
      uploadedFile !== null && uploadedFile !== undefined
        ? uploadedFile.filename
        : data.url;

    const response = await putActivityVideo(
      +activityId,
      data.title,
      data.description,
      url,
      data.parent,
      userId!
    );

    return res
      .status(200)
      .json({ success: true, message: "Activité mise à jour.", response });
  } catch (error: any) {
    console.log({ error });

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
