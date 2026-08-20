import { prisma } from "../../../utils/db.ts";
import path from "path";
import fs from "fs";
import { type Activity, type BonusActivity } from "@prisma/client";

export default async function putActivityVideo(
  activityId: number,
  title: string,
  description: string,
  url: string,
  parentType: "lesson" | "resource",
  userId: string,
) {
  let existingParent: Activity | BonusActivity | null = null;

  if (parentType === "lesson") {
    existingParent = await prisma.activity.findFirst({
      where: { id: activityId },
    });
  } else {
    existingParent = await prisma.bonusActivity.findFirst({
      where: { id: activityId },
    });
  }

  if (!existingParent) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let updatedActivity: Activity | BonusActivity | null = null;

  if (parentType === "lesson")
    updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        ...existingParent,
        title,
        url,
      },
    });
  else
    updatedActivity = await prisma.bonusActivity.update({
      where: { id: activityId },
      data: {
        ...existingParent,
        title,
        url,
      },
    });

  if (!existingParent.url.startsWith("http")) {
    if (existingParent.url !== url) {
      await fs.promises.unlink(
        path.join(
          import.meta.dirname,
          "..",
          "..",
          "..",
          "..",
          "uploads",
          "activities",
          "videos",
          existingParent.url,
        ),
      );
    }
  }
  return updatedActivity;
}
