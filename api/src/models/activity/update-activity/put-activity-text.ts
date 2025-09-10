import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "../../../utils/db";
import { Activity, BonusActivity } from "@prisma/client";

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
  id: number,
  value: string,
  title: string,
  description: string,
  parent: "resource" | "lesson"
) {
  let existingBonusActivity: BonusActivity | null = null;
  let existingActivity: Activity | null = null;

  if (parent === "lesson")
    existingActivity = await prisma.activity.findFirst({
      where: { id },
    });
  else
    existingBonusActivity = await prisma.bonusActivity.findFirst({
      where: { id },
    });

  if (!existingActivity && !existingBonusActivity) {
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

    let updatedActivity: Activity | BonusActivity | null = null;

    if (parent === "lesson")
      updatedActivity = await prisma.activity.update({
        where: { id },
        data: {
          ...existingActivity,
          url: fileName,
          title,
          description,
        },
      });
    else
      updatedActivity = await prisma.bonusActivity.update({
        where: { id },
        data: {
          ...existingBonusActivity,
          url: fileName,
          title,
          description,
        },
      });

    let doublons: Activity[] | BonusActivity[] | null = null;

    parent === "lesson"
      ? (doublons = await prisma.activity.findMany({
          where: {
            url: existingActivity!.url,
          },
        }))
      : (doublons = await prisma.bonusActivity.findMany({
          where: {
            url: existingBonusActivity!.url,
          },
        }));

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
          parent === "lesson"
            ? existingActivity!.url
            : existingBonusActivity!.url
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
