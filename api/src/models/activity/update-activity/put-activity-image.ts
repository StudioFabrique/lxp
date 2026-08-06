import { type Activity, type BonusActivity } from "@prisma/client";
import { prisma } from "../../../utils/db.ts";
//import path from "path";
//import fs from "fs";

/**
 * Updates an image type activity
 * @param activityId - The identifier of the activity to update
 * @param userId - The identifier of the user performing the update
 * @param title - The new title of the activity
 * @param description - The new description of the activity
 * @param filename - The name of the uploaded image file (optional)
 * @param url - The URL of the image from the media library (optional)
 * @param parent - The type of parent entity ("lesson" for Activity, "resource" for BonusActivity)
 * @returns The updated activity
 * @throws {Error} If the user or activity does not exist
 */
export default async function putActivityImage(
  activityId: number,
  userId: string,
  title: string,
  description: string,
  filename: string | null,
  url: string | null,
  parent: "lesson" | "resource" = "lesson",
) {
  // Check that the user exists
  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });
  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  // Initialize variable to hold either Activity or BonusActivity
  let existingElement: Activity | BonusActivity | null = null;

  // Fetch the appropriate entity based on parent type
  if (parent === "lesson") {
    // Handle regular lesson activities
    existingElement = await prisma.activity.findFirst({
      where: { id: activityId },
    });
  } else if (parent === "resource") {
    // Handle bonus resource activities
    existingElement = await prisma.bonusActivity.findFirst({
      where: { id: activityId },
    });
  }

  // Ensure the target activity/resource exists
  if (!existingElement)
    throw {
      statusCode: 404,
      message: "Activity or resource does not exist.",
    };

  // TODO: Handle old file cleanup if needed
  //const oldFilename = existingActivity.url;

  // Updates the activity with the new data
  // Priority order for URL: uploaded file > media library URL > existing URL
  // If a new file is uploaded, use its name
  // Otherwise use the URL from the media library if provided
  // Otherwise keep the existing URL

  // Use transaction to ensure data consistency between activity update and media usage tracking
  const transaction = await prisma.$transaction(async (tx) => {
    // Decrement usage count for the old media if it exists
    if (existingElement.url) {
      const media = await tx.mediatheque.findFirst({
        where: { url: existingElement.url },
      });
      if (media) {
        await tx.mediatheque.update({
          where: { id: media.id },
          data: { used: { decrement: 1 } },
        });
      }
    }

    // Update the appropriate entity based on parent type
    if (parent === "lesson") {
      await prisma.activity.update({
        where: { id: activityId },
        data: {
          title,
          // Use filename if provided, otherwise url from media library, otherwise keep existing
          url: filename ?? url ?? existingElement.url,
        },
      });
    } else {
      await prisma.bonusActivity.update({
        where: { id: activityId },
        data: {
          title,
          // Use filename if provided, otherwise url from media library, otherwise keep existing
          url: filename ?? url ?? existingElement.url,
        },
      });
    }

    // Increment usage count for the new media from library if selected
    if (url) {
      const media = await tx.mediatheque.findFirst({
        where: { url },
      });
      if (media) {
        await tx.mediatheque.update({
          where: { id: media.id },
          data: { used: { increment: 1 } },
        });
      }
    }
  });

  return transaction;
}
