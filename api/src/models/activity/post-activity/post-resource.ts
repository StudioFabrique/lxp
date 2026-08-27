import { type Lesson, type Activity, type Resource, type BonusActivity } from "@prisma/client";
import { prisma } from "../../../utils/db.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";

/**
 * Type definition for a Lesson with its activities included
 */
type LessonWithActivities = Lesson & { activities: Activity[] };

/**
 * Type definition for a Resource with its bonus activities included
 */
type ResourceWithBonusActivities = Resource & {
  bonusActivities: BonusActivity[];
};

/**
 * Creates a resource activity for either a lesson or a resource parent
 *
 * This function handles the upload and creation of resource files that can be attached
 * to either a lesson (as regular activities) or a resource (as bonus activities).
 * It performs the following operations:
 * 1. Validates uploaded files and request data consistency
 * 2. Verifies the existence of the parent entity (lesson or resource)
 * 3. Verifies the author exists in the database
 * 4. Creates the appropriate activity type (Activity or BonusActivity)
 * 5. Links uploaded files as resource activities
 * 6. Registers files in the media library (mediatheque)
 *
 * @param req - Custom Express request object containing:
 *   - files: Array of uploaded files (Multer)
 *   - body.data: Array of resource metadata (label, filename)
 *   - body.data.parent: Type of parent entity ("lesson" | "resource")
 *   - params.lessonId: ID of the parent entity (lesson or resource)
 *   - auth.userId: ID of the authenticated user
 *
 * @returns Object containing the result with count of created resources
 *
 * @throws {Object} Error object with statusCode and message if:
 *   - No files are uploaded (400)
 *   - Number of files doesn't match metadata count (400)
 *   - Parent entity doesn't exist (404)
 *   - Author doesn't exist (404)
 *
 * @example
 * // Request body structure:
 * {
 *   data: [
 *     { label: "Resource 1", filename: "file1.pdf" },
 *     { label: "Resource 2", filename: "file2.pdf" }
 *   ],
 *   parent: "lesson" // or "resource"
 * }
 */
export default async function postActivityResource(req: CustomRequest) {
  // Retrieve uploaded files from the request
  const uploadedFiles = req.files as Express.Multer.File[];
  if (!uploadedFiles || uploadedFiles.length === 0)
    throw { statusCode: 400, message: "Aucun fichier n'a été envoyé" };

  // Extract data from the request
  const { data } = req.body;
  const { lessonId } = req.params;
  const userId = req.auth?.userId;
  const parent: "lesson" | "resource" = req.body.data.parent ?? "lesson";
  const requestedTitle = req.body.data.title;
  const title =
    typeof requestedTitle === "string" && requestedTitle.trim()
      ? requestedTitle.trim()
      : "Ressources";

  // Validate consistency between uploaded files and metadata
  if (data.resources.length !== uploadedFiles.length)
    throw {
      statusCode: 400,
      message:
        "Le nombre de fichiers envoyés ne correspond pas au nombre de ressources",
    };

  // Initialize parent entity variable (can be either a Lesson or Resource)
  let existingParent:
    | LessonWithActivities
    | ResourceWithBonusActivities
    | null = null;

  // Fetch the parent entity based on type
  if (parent === "lesson")
    existingParent = await prisma.lesson.findFirst({
      where: { id: +lessonId },
      include: { activities: true },
    });
  else if (parent === "resource")
    existingParent = await prisma.resource.findFirst({
      where: { id: +lessonId },
      include: { bonusActivities: true },
    });

  // Verify parent entity exists
  if (!existingParent)
    throw { statusCode: 404, message: "L'élément parent n'existe pas" };

  // Fetch the author from database using MongoDB ID
  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  // Verify author exists
  if (!existingAuthor)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas" };

  // Array to store the new resources with their labels and URLs
  let newResources: { label: string; url: string }[] = [];

  // Map uploaded files with their metadata
  for (const resource of data.resources) {
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

  // Initialize result object to store the count of created resources
  let result: { count: number } = { count: 0 };

  // Execute all database operations in a transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    if (parent === "lesson") {
      // Case 1: Parent is a Lesson
      // Create a new Activity of type "resource" for the lesson
      const newActivity = await tx.activity.create({
        data: {
          title,
          lessonId: +lessonId,
          type: "resource",
          // Set order to be the next in sequence after existing activities
          order: (existingParent as LessonWithActivities).activities.length,
          url: "",
          authorId: existingAuthor.id,
        },
      });

      // Create multiple ResourceActivity entries linked to the new activity
      result = await tx.resourceActivity.createMany({
        data: newResources.map((resource, index) => ({
          label: resource.label,
          url: resource.url,
          activityId: newActivity.id,
          order: index, // Maintain order within the resource list
        })),
      });
    } else if (parent === "resource") {
      // Case 2: Parent is a Resource
      // Create a new BonusActivity of type "resource" for the resource
      const newBonusActivity = await tx.bonusActivity.create({
        data: {
          title,
          resourceId: +lessonId,
          type: "resource",
          // Set order to be the next in sequence after existing bonus activities
          order: (existingParent as ResourceWithBonusActivities).bonusActivities
            .length,
          url: "",
          adminId: existingAuthor.id,
        },
      });

      // Create multiple ResourceBonusActivity entries linked to the new bonus activity
      result = await tx.resourceBonusActivity.createMany({
        data: newResources.map((resource, index) => ({
          label: resource.label,
          url: resource.url,
          bonusActivityId: newBonusActivity.id,
          order: index, // Maintain order within the resource list
        })),
      });
    }

    // Register all uploaded files in the media library
    for (const resource of data.resources) {
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

  // Return the result containing the count of created resources
  return { result };
}
