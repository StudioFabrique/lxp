/**
 * Sends an activation email, or activates the user directly when the mailer is disabled.
 *
 * This function performs the following steps:
 * 1. Checks if the user exists in the database.
 * 2. Retrieves the user's role.
 * 3. Generates an activation token containing the user's ID and role.
 * 4. With the mailer disabled, activates the account with the development password.
 * 5. Otherwise sends the email and updates "invitationSent" when it succeeds.
 *
 * @param userId - The ID of the user to send the invitation to.
 * @returns The result of the update operation on the user document.
 * @throws { statusCode: 404 } if the user does not exist.
 * @throws { statusCode: 500 } if the activation email could not be sent.
 */

import User from "../../utils/interfaces/db/user.ts";
import type { IRole } from "../../utils/interfaces/db/role.ts";
import mongoose from "mongoose";
import { activationToken } from "../../helpers/activation-token.ts";
import { mailerDisabled } from "../../config/mailer-disabled.ts";
import { devAccountPasswordHash } from "../../config/dev-account-password.ts";
import { sendPasswordEmail } from "../../services/mailer.ts";
import { env } from "../../config/env.ts";

export default async function putInvitation(userId: string) {
  // Check if the user exists in the database
  const existingUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  }).populate<{ roles: IRole[] }>("roles");

  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  if (existingUser.isActive) {
    throw {
      statusCode: 400,
      message: "Cannot send invitation to an already active user.",
    };
  }

  if (mailerDisabled) {
    // Sans email d'activation, donner au compte le même mot de passe local
    // que les utilisateurs créés avec le mailer désactivé.
    return User.updateOne(
      { _id: existingUser._id, isActive: false },
      {
        $set: {
          isActive: true,
          emailVerified: true,
          password: await devAccountPasswordHash(),
        },
        $unset: { invitationPendingSince: 1 },
      },
    );
  }

  // Retrieve the user's role (assumes the first role is the main one)
  const role = await existingUser.roles[0];

  // Generate an activation token containing the user's ID and role
  const token = activationToken(userId, role, "7d");

  // Send activation email if not in test environment
  if (env.ENVIRONMENT !== "test") {
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
    { $set: { invitationSent: true, invitationSentAt: new Date() } },
  );
  return updateResult;
}
