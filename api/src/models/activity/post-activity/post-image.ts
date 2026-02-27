import { Activity, BonusActivity, Lesson, Resource } from "@prisma/client";
import { prisma } from "../../../utils/db";

/**
 * Creates a new image activity in a lesson or resource
 * @param lessonId - ID of the parent lesson or resource
 * @param userId - MongoDB ID of the user creating the activity
 * @param title - Title of the activity
 * @param filename - Name of the uploaded file (optional)
 * @param url - URL of the image from the media library (optional)
 * @param parent - Type of parent entity ("lesson" or "resource")
 * @returns The newly created activity
 */
export default async function postImage(
  lessonId: number,
  userId: string,
  title: string,
  filename: string | null,
  url: string | null,
  parent: "lesson" | "resource",
) {
  // Check if the user exists
  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });
  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  let existingParent: Lesson | Resource | null = null;

  if (parent === "lesson")
    existingParent = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { activities: true },
    });
  else if (parent === "resource")
    existingParent = await prisma.resource.findFirst({
      where: { id: lessonId },
      include: { bonusActivities: true },
    });

  if (!existingParent)
    throw { statusCode: 404, message: "Lesson or resource does not exist" };

  // Check that an image source is provided (file or URL)
  if (!filename && !url)
    throw {
      statusCode: 400,
      message: "No image source was provided.",
    };

  const transaction = await prisma.$transaction(async (tx) => {
    // Create the new activity

    let newActivity: Activity | BonusActivity | null = null;

    if (parent === "lesson")
      newActivity = await tx.activity.create({
        data: {
          title,
          lessonId,
          type: "image",
          url: filename ?? url ?? "", // Use the filename or URL
          order: (existingParent as Lesson & { activities: Activity[] })
            .activities.length, // Place the activity at the end
          authorId: existingUser.id,
        },
      });
    else if (parent === "resource")
      newActivity = await tx.bonusActivity.create({
        data: {
          title,
          resourceId: lessonId,
          type: "image",
          url: filename ?? url ?? "", // Use the filename or URL
          order: (
            existingParent as Resource & { bonusActivities: BonusActivity[] }
          ).bonusActivities.length, // Place the activity at the end
          adminId: existingUser.id,
        },
      });
    if (url) {
      const media = await tx.mediatheque.findFirst({
        where: { url },
      });
      if (media) {
        await tx.mediatheque.update({
          where: { id: media.id, type: "image" },
          data: { used: { increment: 1 } },
        });
      }
    }
  });
  return;
}
