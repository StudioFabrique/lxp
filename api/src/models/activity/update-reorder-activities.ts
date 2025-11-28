import { Lesson, Resource } from "../../../generated/prisma/client";
import { prisma } from "../../utils/db";

/**
 * Updates the order of activities for either a lesson or a resource
 *
 * This function reorders activities or bonus activities based on the provided array of IDs.
 * The order is determined by the position of each ID in the array, where the first ID
 * gets order 0, the second gets order 1, and so on.
 *
 * The function performs the following operations:
 * 1. Verifies the existence of the parent entity (lesson or resource)
 * 2. Updates the order of each activity/bonus activity in a transaction
 * 3. Ensures all updates are atomic (all succeed or all fail)
 *
 * @param lessonId - ID of the parent entity (despite the name, can be either a lesson or resource ID)
 * @param activitiesIds - Array of activity IDs in the desired order
 * @param parent - Type of parent entity ("lesson" | "resource")
 *
 * @returns Promise that resolves when the transaction completes
 *
 * @throws {Object} Error object with statusCode 404 if the parent entity doesn't exist
 *
 * @example
 * // Reorder activities for a lesson
 * await updateReorderActivities(123, [5, 3, 1, 4, 2], "lesson");
 * // Activity 5 will have order 0, activity 3 will have order 1, etc.
 *
 * @example
 * // Reorder bonus activities for a resource
 * await updateReorderActivities(456, [10, 11, 12], "resource");
 */
export default async function updateReorderActrivities(
  lessonId: number,
  activitiesIds: number[],
  parent: "lesson" | "resource",
) {
  // Initialize parent entity variable (can be either a Lesson or Resource)
  let existingParent: Lesson | Resource | null = null;

  // Fetch the parent entity based on type
  if (parent === "lesson")
    existingParent = await prisma.lesson.findFirst({
      where: { id: lessonId },
    });
  else if (parent === "resource")
    existingParent = await prisma.resource.findFirst({
      where: { id: lessonId },
    });

  // Verify parent entity exists
  if (!existingParent) {
    const error: any = { message: "La leçon n'existe pas.", statusCode: 404 };
    throw error;
  }

  // Execute all updates in a transaction to ensure atomicity
  const transaction = await prisma.$transaction(async (tx) => {
    // Counter to track the new order value
    let i = 0;

    if (parent === "lesson") {
      // Case 1: Parent is a Lesson - update Activity order
      for (const id of activitiesIds) {
        await tx.activity.update({
          where: { id },
          data: {
            order: i, // Set order based on position in array
          },
        });
        i += 1;
      }
    } else if (parent === "resource") {
      // Case 2: Parent is a Resource - update BonusActivity order
      for (const id of activitiesIds) {
        await tx.bonusActivity.update({
          where: { id },
          data: {
            order: i, // Set order based on position in array
          },
        });
        i += 1;
      }
    }
  });

  return transaction;
}
