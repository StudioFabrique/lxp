import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postImage from "../../models/activity/post-activity/post-image";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";

export default async function httpPostImage(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { data } = req.body;
    const file = req.file;
    const userId = req.auth?.userId;
    const { lessonId } = req.params;
    if (file && userId) {
      const filename = file.filename;
      const response = await postImage(
        +lessonId,
        userId,
        data.title,
        data.description,
        filename
      );
      const result = {
        statusCode: 201,
        data: {
          success: true,
          message: "Activité créée avec succès.",
          response,
        },
      };
      next(result);
    }
  } catch (error: any) {
    if (req.file) await deleteTempUploadedFile(req);
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
