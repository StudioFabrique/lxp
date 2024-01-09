import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import updateVideo from "../../models/activity/update-activity/update-video";

export default async function httpPutUpdateVideo(req: Request, res: Response) {
  try {
    const uploadedFile = req.file;
    const { data } = req.body;

    const url =
      uploadedFile !== null && uploadedFile !== undefined
        ? uploadedFile.filename
        : data.url;

    const response = await updateVideo(data.id, url);
    return res
      .status(200)
      .json({ success: true, message: "Activité mise à jour.", response });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
