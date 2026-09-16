import {
  requireDatabaseRow,
  whereFromObject,
} from "../../../utils/prisma-query.ts";
import type { Activity, BonusActivity } from "../../../prisma/model-types.ts";
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
  const existingUser = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  ).first();
  if (!existingUser) throw { statusCode: 404, message: "User does not exist." };

  // Initialize variable to hold either Activity or BonusActivity
  let existingElement: Activity | BonusActivity | null = null;

  // Fetch the appropriate entity based on parent type
  if (parent === "lesson") {
    // Handle regular lesson activities
    existingElement = await prisma.orm.public.Activity.where((row) =>
      whereFromObject(row, { id: activityId }),
    ).first();
  } else if (parent === "resource") {
    // Handle bonus resource activities
    existingElement = await prisma.orm.public.BonusActivity.where((row) =>
      whereFromObject(row, { id: activityId }),
    ).first();
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
  const transaction = await prisma.transaction(async (tx) => {
    // Decrement usage count for the old media if it exists
    if (existingElement.url) {
      const media = await tx.orm.public.Mediatheque.where((row) =>
        whereFromObject(row, { url: existingElement.url }),
      ).first();
      if (media) {
        await tx.execute(
          prisma.raw.sql`UPDATE "Mediatheque" SET "used" = "used" - 1 WHERE "id" = ${media.id}`
            .affectedCount()
            .build(),
        );
      }
    }

    // Update the appropriate entity based on parent type
    if (parent === "lesson") {
      await prisma.orm.public.Activity.where((row) =>
        whereFromObject(row, { id: activityId }),
      )
        .update({ title, url: filename ?? url ?? existingElement.url })
        .then(requireDatabaseRow);
    } else {
      await prisma.orm.public.BonusActivity.where((row) =>
        whereFromObject(row, { id: activityId }),
      )
        .update({ title, url: filename ?? url ?? existingElement.url })
        .then(requireDatabaseRow);
    }

    // Increment usage count for the new media from library if selected
    if (url) {
      const media = await tx.orm.public.Mediatheque.where((row) =>
        whereFromObject(row, { url }),
      ).first();
      if (media) {
        await tx.execute(
          prisma.raw.sql`UPDATE "Mediatheque" SET "used" = "used" + 1 WHERE "id" = ${media.id}`
            .affectedCount()
            .build(),
        );
      }
    }
  });

  return transaction;
}
