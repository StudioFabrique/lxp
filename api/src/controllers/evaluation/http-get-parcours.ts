import getParcours from "../../models/evaluations/getParcours";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";

export default async function httpGetParcours(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.auth?.userId;
    const response = await getParcours(userId!);
    const result = {
      statusCode: 200,
      data: { success: true, data: response },
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
