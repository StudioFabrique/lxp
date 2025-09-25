import { Request, Response, NextFunction } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";
import updateUserRoles from "../../models/user/update-user-roles";

/**
 * HTTP controller to update roles for multiple users
 *
 * This function handles the request to update roles for one or more users.
 * It validates the incoming request, processes the role updates, and passes
 * the result to the next middleware.
 *
 * @param {Request} req - Express request object containing:
 *   - body.usersToUpdate - Array of user IDs to update
 *   - body.rolesId - Array of role IDs to assign to the users
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 *
 * @returns {void} Calls next middleware with result or error
 */
async function httpUpdateUserRoles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("HELLO UPDATE USER ROLES");

  try {
    // Validate request using express-validator
    const result = validationResult(req);

    // If validation fails, return 400 Bad Request
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // Extract user IDs and role IDs from request body
    const { usersToUpdate, rolesId } = req.body;

    // Call service function to update user roles
    await updateUserRoles(usersToUpdate, rolesId);

    // Pass successful result to next middleware
    next({
      statusCode: 200,
      message: "Rôles des utilisateurs mis à jour avec succès.",
    });
  } catch (err: any) {
    // Handle errors and pass to error middleware
    next({
      statusCode: err.statusCode ?? 500,
      message: err.message ?? serverIssue,
    });
  }
}

export default httpUpdateUserRoles;
