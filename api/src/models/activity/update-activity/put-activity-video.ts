import {
  requireDatabaseRow,
  whereFromObject,
} from "../../../utils/prisma-query.ts";
import { prisma } from "../../../utils/db.ts";
import path from "path";
import fs from "fs";
import type { Activity, BonusActivity } from "../../../prisma/model-types.ts";

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
    existingParent = await prisma.orm.public.Activity.where((row) =>
      whereFromObject(row, { id: activityId }),
    ).first();
  } else {
    existingParent = await prisma.orm.public.BonusActivity.where((row) =>
      whereFromObject(row, { id: activityId }),
    ).first();
  }

  if (!existingParent) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAuthor = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  ).first();

  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let updatedActivity: Activity | BonusActivity | null = null;

  if (parentType === "lesson")
    updatedActivity = await prisma.orm.public.Activity.where((row) =>
      whereFromObject(row, { id: activityId }),
    )
      .update({ ...existingParent, title, url })
      .then(requireDatabaseRow);
  else
    updatedActivity = await prisma.orm.public.BonusActivity.where((row) =>
      whereFromObject(row, { id: activityId }),
    )
      .update({ ...existingParent, title, url })
      .then(requireDatabaseRow);

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
