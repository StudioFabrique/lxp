import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postDuplicateParcours from "../../models/parcours/post-duplicate-parcours";

/**
 * Handles the HTTP POST request to duplicate a parcours.
 *
 * @param req - The custom request object containing the parameters and authentication details.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 *
 * @returns A promise that resolves to the duplicated parcours ID and a success status code.
 *
 * @throws Will throw an error if the duplication process fails, with the appropriate status code and message.
 */
export default async function httpPostDuplicateParcours(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract the parcours ID from the request parameters
    const { parcoursId } = req.params;

    // Get the authenticated user ID from the request
    const userId = req.auth?.userId;

    // Call the service function to duplicate the parcours
    const response = await postDuplicateParcours(+parcoursId, userId!);

    // Send successful response with the new parcours ID
    next({
      statusCode: 201, // Created status code
      data: {
        success: true,
        parcoursId: response.id, // ID of the newly created parcours
      },
    });
  } catch (error: any) {
    // Handle any errors that occur during duplication
    next({
      statusCode: error.statusCode ?? 500, // Use error status code or 500 if not provided
      message: error.message, // Forward the error message
    });
  }
}
