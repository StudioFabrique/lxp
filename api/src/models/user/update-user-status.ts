/**
 * Update a user's active status
 *
 * This service function handles updating the active status of a user in the system.
 * It includes several validation checks:
 * 1. Prevents users from changing their own status
 * 2. Verifies the target user exists
 * 3. Ensures the user's email has been verified before activation
 *
 * @param ownId - ID of the user making the request
 * @param userId - ID of the user whose status is being updated
 * @param value - New status value (true = active, false = inactive)
 * @returns The updated user object
 * @throws Error if validation fails or user cannot be updated
 */
import User, { type IUser } from "../../utils/interfaces/db/user.ts";

async function updateUserStatus(ownId: string, userId: string, value: boolean) {
  // Prevent users from changing their own status
  if (ownId === userId) {
    throw {
      message: "Vous ne pouvez pas changer le statut de votre propre compte.",
      statusCode: 400,
    };
  }

  // Verify the target user exists
  let userToUpdate = await User.findOne({ _id: userId });
  if (!userToUpdate) {
    throw [{ message: "L'utilisateur n'existe pas.", statusCode: 404 }];
  }

  // Verify the user's email has been confirmed before activation
  if (!userToUpdate.emailVerified && !userToUpdate.isActive)
    throw {
      message:
        "Vous ne pouvez pas activer le compte d'un utilisateur dont l'email n'a pas encore été vérifié.",
      statusCode: 400,
    };

  // Update the user's active status
  userToUpdate = await User.findByIdAndUpdate(userId, {
    isActive: value,
  });

  // Return the updated user object
  return userToUpdate;
}

export default updateUserStatus;
