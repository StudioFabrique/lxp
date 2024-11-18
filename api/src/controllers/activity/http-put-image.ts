import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import putActivityImage from "../../models/activity/update-activity/put-activity-image";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";

export default async function httpPutImage(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { data } = req.body;
    const file = req.file;
    const userId = req.auth?.userId;
    const { activityId } = req.params;
    let filename: string | null = null;
    if (file) filename = file.filename;

    const response = await putActivityImage(
      +activityId,
      userId ?? "",
      data.title,
      data.description,
      filename
    );
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Activité mise à jour avec succès.",
        response,
      },
    };
    next(result);
  } catch (error: any) {
    if (req.file) await deleteTempUploadedFile(req);
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
