import putAddResource from "../../models/activity/update-activity/put-add-resource";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";

export default async function httpPutAddResource(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await putAddResource(req);
    const result = {
      statusCode: 200,
      data: { message: "La nouvelle ressource a été créée avec succès." },
    };

    next(result);
  } catch (error: any) {
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
