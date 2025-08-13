/**
 * Controller for sending an activation email and updating the "invitationSent" property.
 *
 * This controller handles the PUT /user/invitation/:userId route.
 * It performs the following steps:
 * 1. Extracts the userId from the request parameters.
 * 2. Calls the putInvitation model function to send the activation email and update the user.
 * 3. If successful, passes a success result to the next middleware.
 * 4. If an error occurs, passes an error object to the next middleware.
 *
 * @param req - Express request object, expects userId in req.params
 * @param _res - Express response object (not used, response handled by next middleware)
 * @param next - Express next function for passing results or errors
 */

import { Request, Response, NextFunction } from "express";
import putInvitation from "../../models/user/put-invitation";
import { validationResult } from "express-validator";

export default async function httpPutInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isValid = validationResult(req);

    if (!isValid.isEmpty())
      return res.status(400).json({ errors: isValid.array() });

    // Extract userId from request parameters
    const { userId } = req.params;

    // Send activation email and update invitationSent property
    await putInvitation(userId);

    // Pass success result to next middleware
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Invitation email was sent successfully.",
      },
    };
    next(result);
  } catch (error: any) {
    // Pass error object to next middleware
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
