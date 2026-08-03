/**
 * HTTP Controller: Update User Status
 *
 * This controller handles the API endpoint for updating a user's active status.
 * It validates the requested status value and passes the request to the appropriate service.
 *
 * @file http-update-user-status.ts
 * @endpoint PUT /user/update-user-status
 * @request body.userId - ID of the user to update
 * @request body.value - Boolean value indicating the new status (true = active, false = inactive)
 * @response 201 - Success message when the user is updated successfully
 * @response 400 - Bad request if the value is not a boolean
 * @response 500 - Server error if the update process fails
 */

import { type Response, type NextFunction } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import updateUserStatus from "../../models/user/update-user-status.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { validationResult } from "express-validator";

async function httpUpdateUserStatus(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // Extract user ID and new status value from request body
    const { userId, value } = req.body;

    // Call the service function to update the user's status
    // Pass the authenticated user's ID, target user ID, and new status value
    const updatedUser = await updateUserStatus(
      req.auth?.userId ?? "",
      userId,
      value
    );
    // Construct success message based on the updated user's status
    next({
      statusCode: 201,
      data: {
        success: true,
        // Construct success message based on the new user status
        message: `Le compte de l'utilisateur ${updatedUser?.email} a été ${
          value ? "activé" : "désactivé"
        }.`,
      },
    });
  } catch (error: any) {
    // Return appropriate error response
    // Use the error's status code if available, otherwise default to 500
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message,
    });
  }
}

export default httpUpdateUserStatus;
