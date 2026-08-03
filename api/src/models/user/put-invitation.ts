/**
 * Sends an activation email to a user and updates the "invitationSent" property if the email was sent successfully.
 *
 * This function performs the following steps:
 * 1. Checks if the user exists in the database.
 * 2. Retrieves the user's role.
 * 3. Generates an activation token containing the user's ID and role.
 * 4. Sends an activation email (unless running in test environment).
 * 5. Updates the "invitationSent" property in the database if the email was sent.
 *
 * @param userId - The ID of the user to send the invitation to.
 * @returns The result of the update operation on the user document.
 * @throws { statusCode: 404 } if the user does not exist.
 * @throws { statusCode: 500 } if the activation email could not be sent.
 */

import User from "../../utils/interfaces/db/user.ts";
import mongoose from "mongoose";
import { activationToken } from "../../helpers/activation-token.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";

export default async function putInvitation(userId: string) {
  // Check if the user exists in the database
  const existingUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });

  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  if (existingUser.isActive) {
    throw {
      statusCode: 400,
      message: "Cannot send invitation to an already active user.",
    };
  }

  // Retrieve the user's role (assumes the first role is the main one)
  const role = await existingUser.roles[0];

  // Generate an activation token containing the user's ID and role
  const token = activationToken(userId, role, "7d");

  // Send activation email if not in test environment
  if (process.env.ENVIRONMENT !== "test") {
    try {
      await sendPasswordEmail(existingUser.email, token, "activation");
    } catch (emailError: any) {
      throw {
        statusCode: 500,
        message: "Activation email could not be sent.",
      };
    }
  }

  // Update the "invitationSent" property in the database if the email was sent successfully
  const updateResult = await User.updateOne(
    { _id: existingUser._id },
    { $set: { invitationSent: true, invitationSentAt: new Date() } }
  );
  return updateResult;
}
