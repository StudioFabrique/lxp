import { type Activity, type BonusActivity } from "@prisma/client";
import { prisma } from "../../../utils/db.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";

/**
 * Updates the order of resources within an activity
 *
 * This function reorders resources (ResourceActivity or ResourceBonusActivity)
 * within a parent activity or bonus activity. It validates permissions to ensure
 * only the author can reorder their resources.
 *
 * The function performs the following operations:
 * 1. Validates the parent type ("lesson" or "resource")
 * 2. Verifies the existence of the parent activity
 * 3. Verifies the author exists and has permission to modify the resources
 * 4. Updates the order of each resource in a transaction
 *
 * @param req - Custom Express Request object containing:
 *   - params.activityId: ID of the activity containing the resources
 *   - body.activitiesIds: Array of resource IDs in desired order
 *   - body.parent: Optional parent type ("lesson" | "resource"), defaults to "lesson"
 *   - auth.userId: MongoDB ID of the authenticated user
 *
 * @returns Promise that resolves when the transaction completes
 *
 * @throws {Object} Error object with statusCode and message if:
 *   - Parent type is invalid (400)
 *   - Parent activity doesn't exist (404)
 *   - Author doesn't exist (404)
 *   - User is not the owner of the activity (406)
 *
 * @example
 * // Request body for reordering resources in a lesson activity:
 * {
 *   "activitiesIds": [5, 3, 1, 4, 2],
 *   "parent": "lesson"
 * }
 *
 * @example
 * // Request body for reordering resources in a resource bonus activity:
 * {
 *   "activitiesIds": [10, 11, 12],
 *   "parent": "resource"
 * }
 */
export default async function putReorderResource(req: CustomRequest) {
  // Extract parent type and resource IDs from request body
  let { activitiesIds, parent } = req.body;

  // Extract activity ID from URL parameters
  const { activityId } = req.params;

  // Extract user ID from authentication context
  const userId = req.auth?.userId;

  // Default to "lesson" if parent type is not specified
  if (!parent) parent = "lesson";

  // Validate parent type is either "lesson" or "resource"
  if (parent !== "lesson" && parent !== "resource")
    throw { statusCode: 400, message: "Parent invalide." };

  // Initialize activity variable (can be either Activity or BonusActivity)
  let existingActivity: Activity | BonusActivity | null = null;


  // Fetch the parent activity based on type
  if (parent === "lesson") {
    // Case 1: Parent is a Lesson - fetch Activity
    existingActivity = await prisma.activity.findFirst({
      where: { id: +activityId },
    });
  } else if (parent === "resource") {
    // Case 2: Parent is a Resource - fetch BonusActivity
    existingActivity = await prisma.bonusActivity.findFirst({
      where: { id: +activityId },
    });
  }

  // Verify parent activity exists
  if (!existingActivity)
    throw { statusCode: 404, message: "Le parent n'existe pas." };

  // Fetch the author from database using MongoDB ID
  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  // Verify author exists
  if (!existingAuthor)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  // Verify user is the owner of the activity
  // Activity uses 'authorId', BonusActivity uses 'adminId'
  if (
    (existingActivity as Activity).authorId !== existingAuthor.id &&
    (existingActivity as BonusActivity).adminId !== existingAuthor.id
  )
    throw {
      statusCode: 406,
      message: "Vous n'êtes pas le propriétaire de la ressource.",
    };

  // Execute all updates in a transaction to ensure atomicity
  const transaction = await prisma.$transaction(async (tx) => {
    if (parent === "lesson") {
      // Case 1: Parent is a Lesson - update ResourceActivity order
      for (const [index, resourceId] of activitiesIds.entries()) {
        await tx.resourceActivity.update({
          where: { id: resourceId },
          data: { order: index }, // Set order based on position in array
        });
      }
    } else if (parent === "resource") {
      // Case 2: Parent is a Resource - update ResourceBonusActivity order
      for (const [index, resourceId] of activitiesIds.entries()) {
        await tx.resourceBonusActivity.update({
          where: { id: resourceId },
          data: { order: index }, // Set order based on position in array
        });
      }
    }
  });

  return transaction;
}
