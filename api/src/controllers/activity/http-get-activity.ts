import { Request, Response, NextFunction } from "express";
import getActivity from "../../models/activity/get-activity";

export default async function httpGetActivity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { activityId } = req.params;
    const activity = await getActivity(+activityId);
    const result = {
      statusCode: 200,
      data: {
        success: true,
        activity,
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
