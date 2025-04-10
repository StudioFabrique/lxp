import { activationToken } from "../../helpers/activation-token";
import { sendPasswordEmail } from "../../services/mailer";
import User from "../../utils/interfaces/db/user";

/**
 * Send activation invitations to multiple users
 *
 * This service function handles sending password setup/activation emails
 * to multiple users identified by their IDs. For each user, it:
 * 1. Generates a unique activation token with the user's role
 * 2. Sends an activation email with the token
 *
 * @param userIds - Array of user IDs to send invitations to
 * @returns A Promise that resolves when all invitations have been sent
 * @throws Error if any users are not found or if email sending fails
 */
export default async function postManyInvitations(userIds: string[]) {
  // Retrieve all users by the provided IDs and populate their roles
  const users = await User.find({
    _id: {
      $in: userIds,
    },
  }).populate("roles");

  // Validate that all requested users were found
  if (users.length !== userIds.length) {
    throw {
      message: "Un ou plusieurs utilisateurs n'ont pas été trouvés.",
      statusCode: 404,
    };
  }

  let i = 0;
  // Process each user and send activation emails
  for (const user of users) {
    // If the account is not already active, proceed with sending the invitation
    if (!user.isActive) {
      // Generate a unique activation token valid for 7 days
      const token = activationToken(user._id, user.roles[0], "7d");

      // Send the activation email with the token
      await sendPasswordEmail(user.email, token, "activation");
      await User.updateOne(
        { _id: user._id },
        { $set: { invitationSent: true } }
      );
      i += 1;
    }
  }

  // Return after successful processing of all users
  return i;
}
