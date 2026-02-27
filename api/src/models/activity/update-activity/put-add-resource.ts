import {
  Activity,
  ResourceActivity,
  BonusActivity,
  ResourceBonusActivity,
} from "@prisma/client";
import { prisma } from "../../../utils/db";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

/**
 * Type definition for an Activity with its resource activities included
 */
type ActivityWithResources = Activity & {
  resourceActivities: ResourceActivity[];
};

/**
 * Type definition for a BonusActivity with its resource bonus activities included
 */
type BonusActivityWithResources = BonusActivity & {
  resourceBonusActivities: ResourceBonusActivity[];
};

/**
 * Adds new resources to an existing activity or bonus activity
 *
 * This function handles the upload and addition of resource files to an existing
 * activity (for lessons) or bonus activity (for resources). It validates permissions
 * to ensure only the author can add resources to their activities.
 *
 * The function performs the following operations:
 * 1. Validates uploaded files exist
 * 2. Verifies the existence of the parent activity
 * 3. Verifies the author exists and has permission to modify the activity
 * 4. Creates new resource entries linked to the activity
 * 5. Registers files in the media library (mediatheque)
 *
 * @param req - Custom Express Request object containing:
 *   - files: Array of uploaded files (Multer)
 *   - body.data.dataIds: Array of resource metadata (label, filename)
 *   - body.data.parent: Type of parent entity ("lesson" | "resource")
 *   - params.activityId: ID of the parent activity
 *   - auth.userId: MongoDB ID of the authenticated user
 *
 * @returns Promise that resolves when the transaction completes
 *
 * @throws {Object} Error object with statusCode and message if:
 *   - No files are uploaded (400)
 *   - Parent activity doesn't exist (404)
 *   - Author doesn't exist (404)
 *   - User is not the owner of the activity (406)
 *
 * @example
 * // Request body structure:
 * {
 *   data: {
 *     dataIds: [
 *       { label: "Resource 1", filename: "file1.pdf" },
 *       { label: "Resource 2", filename: "file2.pdf" }
 *     ],
 *     parent: "lesson" // or "resource"
 *   }
 * }
 */
export default async function putAddResource(req: CustomRequest) {
  // Retrieve uploaded files from the request
  const uploadedFiles = req.files as Express.Multer.File[];
  if (!uploadedFiles || uploadedFiles.length === 0)
    throw { statusCode: 400, message: "Aucun fichier n'a été envoyé" };

  // Extract data from the request
  const { data } = req.body;
  let { activityId, parent } = req.params;

  if (!parent) parent = "lesson";

  if (parent !== "lesson" && parent !== "resource")
    throw {
      statusCode: 400,
      message: "Le parent de l'activité n'est pas valide",
    };

  const userId = req.auth?.userId;

  // Initialize parent activity variable (can be either Activity or BonusActivity)
  let existingParent:
    | ActivityWithResources
    | BonusActivityWithResources
    | null = null;

  // Fetch the parent activity based on type
  if (parent === "lesson")
    existingParent = await prisma.activity.findFirst({
      where: { id: +activityId },
      include: {
        resourceActivities: true,
      },
    });
  else if (parent === "resource")
    existingParent = await prisma.bonusActivity.findFirst({
      where: { id: +activityId },
      include: {
        resourceBonusActivities: true,
      },
    });

  // Verify parent activity exists
  if (!existingParent)
    throw { statusCode: 404, message: "L'activité n'existe pas." };

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
    (existingParent as Activity).authorId !== existingAuthor.id &&
    (existingParent as BonusActivity).adminId !== existingAuthor.id
  )
    throw {
      statusCode: 406,
      message: "Vous n'êtes pas le propriétaire de la ressource.",
    };

  // Array to store the new resources with their labels and URLs
  let newResources: { label: string; url: string }[] = [];

  // Map uploaded files with their metadata
  for (const resource of data) {
    const file = uploadedFiles.find(
      (file) => file.originalname === resource.filename,
    );
    if (file) {
      newResources = [
        ...newResources,
        { label: resource.label, url: file.filename },
      ];
    }
  }

  // Execute all database operations in a transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    if (parent === "lesson") {
      // Case 1: Parent is a Lesson Activity
      // Add new ResourceActivity entries to the existing activity
      await tx.activity.update({
        where: { id: +activityId },
        data: {
          resourceActivities: {
            create: newResources.map((resource, index) => ({
              label: resource.label,
              url: resource.url,
              // Set order to be the next in sequence after existing resources
              order:
                (existingParent as ActivityWithResources).resourceActivities
                  .length + index,
            })),
          },
        },
      });
    } else if (parent === "resource") {
      // Case 2: Parent is a Resource BonusActivity
      // Add new ResourceBonusActivity entries to the existing bonus activity
      await tx.bonusActivity.update({
        where: { id: +activityId },
        data: {
          resourceBonusActivities: {
            create: newResources.map((resource, index) => ({
              label: resource.label,
              url: resource.url,
              // Set order to be the next in sequence after existing resources
              order:
                (existingParent as BonusActivityWithResources)
                  .resourceBonusActivities.length + index,
            })),
          },
        },
      });
    }

    // Register all uploaded files in the media library
    for (const resource of data) {
      const file = uploadedFiles.find(
        (file) => file.originalname === resource.filename,
      );

      if (file) {
        // Create a mediatheque entry for tracking file usage
        await tx.mediatheque.create({
          data: {
            type: "resource",
            name: resource.filename,
            url: file.filename,
            size: file.size,
            used: 1, // Mark as used once
            author: {
              connect: { id: existingAuthor.id },
            },
          },
        });
      }
    }
  });

  return;
}
