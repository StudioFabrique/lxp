import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putActivityVideo from "../../models/activity/update-activity/put-activity-video";

export default async function httpPutActivityVideo(
  req: Request,
  res: Response
) {
  try {
    const uploadedFile = req.file;
    const { data } = req.body;
    const { activityId } = req.params;

    console.log({ activityId });

    const url =
      uploadedFile !== null && uploadedFile !== undefined
        ? uploadedFile.filename
        : data.url;

    const response = await putActivityVideo(
      +activityId,
      data.title,
      data.description,
      url
    );

    return res
      .status(200)
      .json({ success: true, message: "Activité mise à jour.", response });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
