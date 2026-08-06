/**
 * Deletes a user from the system
 *
 * This function removes a user from both MongoDB and Prisma databases.
 * It handles different user types (admin vs student) appropriately and
 * includes safety checks to prevent self-deletion and handle errors.
 *
 * @param {string} userId - ID of the user to delete
 * @param {string} connectedId - ID of the currently connected user making the request
 *
 * @throws {Object} Error with statusCode 400 if user tries to delete their own account
 * @throws {Object} Error with statusCode 404 if user doesn't exist
 * @throws {Object} Error with statusCode 500 if deletion fails in MongoDB
 *
 * @returns {Promise<void>} Resolves when user is successfully deleted
 */

import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function deleteUser(userId: string, connectedId: string) {
  // Prevent users from deleting their own account
  if (userId === connectedId)
    throw {
      message: "Vous ne pouvez pas supprimer votre propre compte.",
      statusCode: 400,
    };

  // Find the user to delete with their roles
  const userToDelete = await User.findOne({ _id: userId }).populate("roles");

  // Check if user exists
  if (!userToDelete)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  let prismaUser: any;

  const transaction = await prisma.$transaction(async (tx) => {
    // Handle admin users (rank <= 2) differently from regular users
    if (userToDelete.roles[0].rank <= 2) {
      // Get admin from Prisma database
      prismaUser = await tx.admin.findFirst({
        where: { idMdb: userId },
      });

      if (prismaUser) {
        await tx.admin.deleteMany({ where: { idMdb: userId } });
      }

      const prismaContact = await tx.contact.findFirst({
        where: { idMdb: userId },
      });

      if (prismaContact) {
        try {
          await tx.contact.deleteMany({ where: { idMdb: userId } });
        } catch (error) {
          throw {
            statusCode: 500,
            message:
              "Une erreur est survenue lors de la suppression de la ressource pédagogique. Vérifiez qu'il ne soit pas lié à du contenu pédagogique.",
          };
        }
      }
    } else {
      // Get student from Prisma database
      prismaUser = await tx.student.findFirst({
        where: { idMdb: userId },
      });
      // Delete from Prisma student table
      if (prismaUser) await tx.student.deleteMany({ where: { idMdb: userId } });
    }

    try {
      // Delete user from MongoDB
      await User.deleteOne().where({ _id: userId });
    } catch (error) {
      throw {
        statusCode: 500,
        message:
          "Une erreur est survenue lors de la suppression de l'utilisateur.",
      };
    }
  });
}
