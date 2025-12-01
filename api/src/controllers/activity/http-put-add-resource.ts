import putAddResource from "../../models/activity/update-activity/put-add-resource";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";

/**
 * HTTP PUT controller for adding resources to an existing activity
 *
 * This controller handles requests to add new resource files to an existing
 * activity (for lessons) or bonus activity (for resources). It validates
 * permissions to ensure only the activity owner can add resources.
 *
 * Unlike typical Express controllers, this one uses a middleware pattern
 * by passing the result to the next() function instead of directly sending
 * a response. This allows for additional middleware processing if needed.
 *
 * @param req - Custom Express Request object containing:
 *   - files: Array of uploaded files (Multer)
 *   - body.data.dataIds: Array of resource metadata (label, filename)
 *   - body.data.parent: Type of parent entity ("lesson" | "resource")
 *   - params.activityId: ID of the parent activity
 *   - auth.userId: MongoDB ID of the authenticated user
 * @param _res - Express Response object (unused, prefixed with _ by convention)
 * @param next - Express NextFunction to pass control to next middleware
 *
 * @returns Calls next() with either:
 *   - Success object: { statusCode: 200, data: { message: string } }
 *   - Error object: { statusCode: number, message: string }
 *
 * @example
 * // Request body for adding resources to a lesson activity:
 * {
 *   data: {
 *     dataIds: [
 *       { label: "Resource 1", filename: "file1.pdf" },
 *       { label: "Resource 2", filename: "file2.pdf" }
 *     ],
 *     parent: "lesson"
 *   }
 * }
 *
 * @example
 * // Request body for adding resources to a resource bonus activity:
 * {
 *   data: {
 *     dataIds: [
 *       { label: "Bonus Resource", filename: "bonus.pdf" }
 *     ],
 *     parent: "resource"
 *   }
 * }
 */
export default async function httpPutAddResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    // Call the service function to add resources to the activity
    await putAddResource(req);

    // Prepare success result object
    const result = {
      statusCode: 200,
      data: { message: "La nouvelle ressource a été créée avec succès." },
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
