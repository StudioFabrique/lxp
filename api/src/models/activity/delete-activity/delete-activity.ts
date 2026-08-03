import fs from "node:fs/promises";

import {
  collectUnusedActivityFiles,
  deleteActivityFiles,
  extractLocalImagesFromHtml,
  resolveActivityFilePath,
  type StoredActivityFileReference,
  type StoredActivityFileType,
} from "../../../helpers/activity-file-cleanup";
import { prisma } from "../../../utils/db";

export default async function deleteActivity(
  activityId: number,
  _type: string,
  parent = "lesson",
) {
  const isLessonActivity = parent === "lesson";
  const existingActivity = isLessonActivity
    ? await prisma.activity.findFirst({
        where: { id: activityId },
        select: {
          id: true,
          type: true,
          url: true,
          resourceActivities: { select: { url: true } },
        },
      })
    : await prisma.bonusActivity.findFirst({
        where: { id: activityId },
        select: {
          id: true,
          type: true,
          url: true,
          resourceBonusActivities: { select: { url: true } },
        },
      });

  if (!existingActivity) {
    throw { statusCode: 404, message: "L'activité n'existe pas" };
  }

  const activityType = existingActivity.type as StoredActivityFileType;
  const references: StoredActivityFileReference[] = [];

  if (activityType === "resource") {
    const resources = isLessonActivity
      ? (existingActivity as { resourceActivities: { url: string }[] })
          .resourceActivities
      : (existingActivity as { resourceBonusActivities: { url: string }[] })
          .resourceBonusActivities;

    references.push(
      ...resources.map(({ url }) => ({
        url,
        type: "resource" as const,
        trackedInMediatheque: true,
      })),
    );
  } else if (activityType === "text") {
    const textReference: StoredActivityFileReference = {
      url: existingActivity.url,
      type: "text",
      trackedInMediatheque: false,
    };
    references.push(textReference);

    const textPath = resolveActivityFilePath(textReference);
    if (textPath) {
      try {
        const fileContent = await fs.readFile(textPath, "utf-8");
        references.push(...extractLocalImagesFromHtml(fileContent));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }
  } else if (activityType === "image" || activityType === "video") {
    references.push({
      url: existingActivity.url,
      type: activityType,
      trackedInMediatheque: true,
    });
  }

  const filesToDelete = await prisma.$transaction(async (tx) => {
    if (isLessonActivity) {
      await tx.activity.delete({ where: { id: activityId } });
    } else {
      await tx.bonusActivity.delete({ where: { id: activityId } });
    }

    if (activityType === "text") {
      const [remainingActivities, remainingBonusActivities] =
        await Promise.all([
          tx.activity.count({ where: { url: existingActivity.url } }),
          tx.bonusActivity.count({ where: { url: existingActivity.url } }),
        ]);

      // Certaines anciennes duplications partagent le même fichier texte.
      // Le fichier et ses images ne peuvent être nettoyés qu'au dernier usage.
      if (remainingActivities + remainingBonusActivities > 0) return [];
    }

    return collectUnusedActivityFiles(tx, references);
  });

  await deleteActivityFiles(filesToDelete);
}
