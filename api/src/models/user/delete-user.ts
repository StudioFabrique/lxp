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

import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

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

  // Handle admin users (rank <= 2) differently from regular users
  if (userToDelete.roles[0].rank <= 2) {
    // Get admin from Prisma database
    prismaUser = await prisma.admin.findFirst({
      where: { idMdb: userId },
    });

    // if (!prismaUser)
    //   throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

    // Delete from Prisma admin table
    if (prismaUser) {
      await prisma.admin.deleteMany({ where: { idMdb: userId } });
    }
  } else {
    // Get student from Prisma database
    prismaUser = await prisma.student.findFirst({
      where: { idMdb: userId },
    });

    // Delete from Prisma student table
    if (prismaUser)
      await prisma.student.deleteMany({ where: { idMdb: userId } });
  }

  try {
    // Delete user from MongoDB
    await User.deleteOne().where({ _id: userId });
  } catch (error) {
    // If MongoDB deletion fails, restore the user in Prisma
    if (userToDelete.roles.rank <= 2) {
      await prisma.admin.create({ data: prismaUser });
    } else {
      await prisma.student.create({ data: prismaUser });
    }

    throw {
      statusCode: 500,
      message:
        "Une erreur est survenue lors de la suppression de l'utilisateur.",
    };
  }
}
