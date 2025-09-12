import { Request, Response, NextFunction } from "express";
import deletaActivity from "../../models/activity/delete-activity/delete-activity";

/**
 * HTTP handler for deleting an activity.
 *
 * @param req - Express request object containing the activity ID in params
 * @param res - Express response object
 * @param next - Express next middleware function
 *
 * @throws Will throw and pass error to next() if deletion fails
 *
 * @returns Promise<void> - Calls next() with success message or error
 */
export default async function httpDeleteImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { activityId, type } = req.params;

    await deletaActivity(+activityId, type);
    next({
      statusCode: 200,
      data: { message: `L'activité de type ${type} a bien été supprimée.` },
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message,
    });
  }
}
