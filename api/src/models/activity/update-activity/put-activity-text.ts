import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "../../../utils/db";

/**
 * Updates an activity's text content, title, and description.
 * Creates a new MDX file with the content and updates the database record.
 * 
 * @param activityId - The ID of the activity to update
 * @param value - The new text content of the activity
 * @param title - The new title for the activity
 * @param description - The new description for the activity
 * 
 * @throws {Error} If the activity doesn't exist (404)
 * @throws {Error} If the document update fails
 * 
 * @returns {Promise<Activity>} The updated activity record
 * 
 * @remarks
 * - Generates a unique filename using UUID v4 and timestamp
 * - Saves content to an MDX file in the uploads/activities directory
 * - Updates the activity record in the database with new metadata
 * - Removes the old file if it's no longer referenced by any activity
 */
export default async function putActivityText(
  activityId: number,
  value: string,
  title: string,
  description: string
) {
  const existingActivity = await prisma.activity.findFirst({
    where: { id: activityId },
  });

  if (!existingActivity) {
    const error = new Error("L'activité n'existe pas.");
    (error as any).statusCode = 404;
    throw error;
  }
  const uniqueID: string = uuidv4();
  const fileName: string = uniqueID + new Date().getTime() + ".mdx";

  try {
    const file = fs.writeFileSync(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "activities",
        fileName
      ),
      value
    );

    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        ...existingActivity,
        url: fileName,
        title,
        description,
      },
    });

    const doublons = await prisma.activity.findMany({
      where: {
        url: existingActivity.url
      }
    });

    if (doublons && doublons.length === 0) {

    await fs.promises.unlink(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "activities",
        existingActivity.url
      )
    );
  }
    return updatedActivity;
  } catch (error: any) {
    throw new Error(
      "Le document n'a pas pu être mis à jour, réessayez plus tard svp..."
    );
  }
}
