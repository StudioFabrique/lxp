/**
 * HTTP Controller: Send invitations to multiple users
 *
 * This controller handles the API endpoint for sending batch invitations to multiple users
 * by their IDs. The invitations are processed and sent via email to each user.
 *
 * @file http-post-many-invitations.ts
 * @endpoint POST /user/invitations
 * @request body.userIds - Array of user IDs to send invitations to
 * @response 200 - Success message indicating invitations were sent
 * @response 500 - Server error if invitation process fails
 */

import { Request, Response, NextFunction } from "express";
import postManyInvitations from "../../models/user/post-many-invitations";

export default async function httpPostManyInvitations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract user IDs from request body
  const { userIds } = req.body;

  try {
    // Call the service function to process and send invitations
    const result = await postManyInvitations(userIds);

    // The message is constructed based on the result of the invitation process
    // If result is 0, it means no invitations were sent
    const message =
      result === 0
        ? "Aucune invitation n'a été envoyée, tous les comptes utilisateurs sont déjà activés."
        : `${result} invitation(s) ont été envoyée(s)`;

    // Pass success response to next middleware
    next({
      statusCode: 200,
      data: {
        success: true,
        message,
      },
    });
  } catch (error: any) {
    // Handle and forward any errors that occur during the invitation process
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message,
    });
  }
}
