import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import putReorderResource from "../../models/activity/update-activity/put-reorder-resource";

export default async function httpPutReorderResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    await putReorderResource(req);
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "L'ordre des ressources a été mis à jour avec succès.",
      },
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
