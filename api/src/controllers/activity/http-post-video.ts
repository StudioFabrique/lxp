import { Request, Response } from "express";
import postVideo from "../../models/activity/post-activity/post-video";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpPostVideo(req: CustomRequest, res: Response) {
  try {
    const uploadedFile = req.file;
    const userId = req.auth?.userId;
    const { lessonId } = req.params;
    const data = JSON.parse(req.body.data);

    const url =
      uploadedFile !== null && uploadedFile !== undefined
        ? uploadedFile.filename
        : data.url;

    const response = await postVideo(
      +lessonId,
      userId!,
      data.type,
      data.order,
      url
    );

    return res.status(201).json({
      success: true,
      message: "Vidéo téléversée avec succès",
      response,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
