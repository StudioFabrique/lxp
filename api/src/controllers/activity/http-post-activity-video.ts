import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postActivityVideo from "../../models/activity/post-activity/post-activity-video";
import { validationResult } from "express-validator";

export default async function httpPostActivityVideo(
  req: CustomRequest,
  res: Response
) {
  try {
    const uploadedFile = req.file;
    const userId = req.auth?.userId;
    let { lessonId, parentType } = req.params;
    const data = req.body.data;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result.array());

      throw { statusCode: 400, message: "Données invalides" };
    }

    if (!parentType) parentType = "lesson";

    const url =
      uploadedFile !== null && uploadedFile !== undefined
        ? uploadedFile.filename
        : data.url;

    const response = await postActivityVideo(
      +lessonId,
      userId!,
      data.title,
      data.description,
      url,
      data.parentType
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
