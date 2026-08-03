import { type Response, type NextFunction } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import putReorderResource from "../../models/activity/update-activity/put-reorder-resource.ts";

/**
 * HTTP PUT controller for reordering resources within an activity
 *
 * This controller handles requests to update the display order of resources
 * attached to an activity (either regular resources or bonus resources).
 * The order is determined by the position of resource IDs in the request array.
 *
 * Unlike typical Express controllers, this one uses a middleware pattern
 * by passing the result to the next() function instead of directly sending
 * a response. This allows for additional middleware processing if needed.
 *
 * @param req - Custom Express Request object containing:
 *   - params.activityId: ID of the activity containing the resources
 *   - body.resourcesIds: Array of resource IDs in desired order
 *   - body.parent: Optional parent type ("lesson" | "resource")
 * @param _res - Express Response object (unused, prefixed with _ by convention)
 * @param next - Express NextFunction to pass control to next middleware
 *
 * @returns Calls next() with either:
 *   - Success object: { statusCode: 200, data: { success: true, message: string } }
 *   - Error object: { statusCode: number, message: string }
 *
 * @example
 * // Request body for reordering resources:
 * {
 *   "resourcesIds": [5, 3, 1, 4, 2],
 *   "parent": "lesson"
 * }
 */
export default async function httpPutReorderResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    // Call the service function to update resource order
    await putReorderResource(req);

    // Prepare success result object
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "L'ordre des ressources a été mis à jour avec succès.",
      },
    };

    // Pass result to next middleware
    next(result);
  } catch (error: any) {
    // Handle errors and prepare error object
    // Use error's statusCode if available, otherwise default to 500
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };

    // Pass error to next middleware (typically error handler)
    next(err);
  }
}
