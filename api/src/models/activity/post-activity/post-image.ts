import { requireDatabaseRow } from "../../../utils/require-database-row.ts";
import type {
  Activity,
  BonusActivity,
  Lesson,
  Resource,
} from "../../../prisma/model-types.ts";
import { prisma } from "../../../utils/db.ts";

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
  const existingUser = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();
  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  let existingParent: Lesson | Resource | null = null;

  if (parent === "lesson")
    existingParent = await prisma.orm.public.Lesson.where({ id: lessonId })
      .include("activities")
      .first();
  else if (parent === "resource")
    existingParent = await prisma.orm.public.Resource.where({ id: lessonId })
      .include("bonusActivities")
      .first();

  if (!existingParent)
    throw { statusCode: 404, message: "Lesson or resource does not exist" };

  // Check that an image source is provided (file or URL)
  if (!filename && !url)
    throw {
      statusCode: 400,
      message: "No image source was provided.",
    };

  const transaction = await prisma.transaction(async (tx) => {
    // Create the new activity

    let newActivity: Activity | BonusActivity | null = null;

    if (parent === "lesson")
      newActivity = await tx.orm.public.Activity.create({
        title,
        lessonId,
        type: "image",
        url: filename ?? url ?? "",
        order: (existingParent as Lesson & { activities: Activity[] })
          .activities.length,
        authorId: existingUser.id,
      });
    else if (parent === "resource")
      newActivity = await tx.orm.public.BonusActivity.create({
        title,
        resourceId: lessonId,
        type: "image",
        url: filename ?? url ?? "",
        order: (
          existingParent as Resource & { bonusActivities: BonusActivity[] }
        ).bonusActivities.length,
        adminId: existingUser.id,
      });
    if (url) {
      const media = await tx.orm.public.Mediatheque.where({ url }).first();
      if (media) {
        await tx.execute(
          prisma.raw
            .sql`UPDATE "Mediatheque" SET "used" = "used" + 1 WHERE "id" = ${media.id} AND "type" = 'image'`
            .affectedCount()
            .build(),
        );
      }
    }
  });
  return;
}
