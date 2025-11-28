import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import updateReorderActrivities from "../../models/activity/update-reorder-activities";

/**
 * HTTP PUT controller for reordering activities within a lesson or resource
 *
 * This controller handles requests to update the display order of activities.
 * It supports reordering both regular activities (for lessons) and bonus activities
 * (for resources).
 *
 * The order is determined by the position of activity IDs in the request array,
 * where the first ID receives order 0, the second receives order 1, and so on.
 *
 * @param req - Express Request object containing:
 *   - params.lessonId: ID of the parent entity (lesson or resource)
 *   - body.activitiesIds: Array of activity IDs in desired order
 *   - body.parent: Optional parent type ("lesson" | "resource"), defaults to "lesson"
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - Success (200): { success: true, message: string, response: transaction }
 *   - Error (4xx/5xx): { message: string }
 *
 * @example
 * // Request body for reordering lesson activities:
 * {
 *   "activitiesIds": [5, 3, 1, 4, 2],
 *   "parent": "lesson"
 * }
 *
 * @example
 * // Request body for reordering resource bonus activities:
 * {
 *   "activitiesIds": [10, 11, 12],
 *   "parent": "resource"
 * }
 */
export default async function httpPutReorderActivities(
  req: Request,
  res: Response,
) {
  try {
    // Extract lesson/resource ID from URL parameters
    const { lessonId } = req.params;

    // Extract activity IDs array and parent type from request body
    let { activitiesIds, parent } = req.body;

    console.log({ activitiesIds, parent });

    // Default to "lesson" if parent type is not specified
    if (!parent) parent = "lesson";

    // Call the service function to update activity order
    const response = await updateReorderActrivities(
      +lessonId, // Convert lessonId to number
      activitiesIds,
      parent,
    );

    // Return success response with confirmation message
    return res.status(200).json({
      success: true,
      message: "L'ordre des activités a bien été modifié.",
      response,
    });
  } catch (error: any) {
    // Handle errors and return appropriate status code and message
    // Use error's statusCode if available, otherwise default to 500
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
