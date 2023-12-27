import { Request, Response } from "express";
import postVideo from "../../models/activity/post-activity/post-video";

export default async function httpPostVideo(req: Request, res: Response) {
  try {
    console.log(req.body);

    const uploadedFile = req.file;
    const { lessonId } = req.params;
    const body = JSON.parse(req.body);
    const data = body.data;
    console.log({ data });

    const url =
      uploadedFile !== null && uploadedFile !== undefined
        ? process.env.STATIC_FILES_URL + uploadedFile.path
        : data.url;

    const response = await postVideo(+lessonId, data.type, data.order, url);

    return res.status(201).json({
      success: true,
      message: "Vidéo téléversée avec succès",
      response,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
