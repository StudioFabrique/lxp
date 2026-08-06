import { type Request, type Response, type NextFunction } from "express";
import deletaActivity from "../../models/activity/delete-activity/delete-activity.ts";

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
  _res: Response,
  next: NextFunction,
) {
  try {
    const { activityId, type, parent } = req.params;

    await deletaActivity(+activityId, type, parent);
    next({
      statusCode: 200,
      data: {
        success: true,
        message: `L'activité de type ${type} a bien été supprimée.`,
      },
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message,
    });
  }
}
