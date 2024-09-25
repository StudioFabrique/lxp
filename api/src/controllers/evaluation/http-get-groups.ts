import getGroups from "../../models/evaluations/get-groups";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";

export default async function httpGetGroups(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { parcoursId } = req.params;
    const userId = req.auth?.userId;

    const response = await getGroups(+parcoursId, userId!);
    const result = {
      statusCode: 200,
      data: { success: true, data: response },
    };
    next(result);
  } catch (error: any) {
    const err = { statusCode: error.statusCode ?? 500, message: error.message };
    next(err);
  }
}
