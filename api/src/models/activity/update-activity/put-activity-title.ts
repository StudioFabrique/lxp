import {
  requireDatabaseRow,
  whereFromObject,
} from "../../../utils/prisma-query.ts";
import { prisma } from "../../../utils/db.ts";
import type { Activity, BonusActivity } from "../../../prisma/model-types.ts";

/** Updates only the title of an activity attached to a lesson or resource. */
export default async function putActivityTitle(
  activityId: number,
  title: string,
  parent: "lesson" | "resource",
  userId: string,
) {
  const existingAuthor = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  )
    .select("id")
    .first();

  if (!existingAuthor) {
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  }

  const existingActivity: Activity | BonusActivity | null =
    parent === "lesson"
      ? await prisma.orm.public.Activity.where((row) =>
          whereFromObject(row, { id: activityId }),
        ).first()
      : await prisma.orm.public.BonusActivity.where((row) =>
          whereFromObject(row, { id: activityId }),
        ).first();

  if (!existingActivity) {
    throw { statusCode: 404, message: "L'activité n'existe pas." };
  }

  return parent === "lesson"
    ? prisma.orm.public.Activity.where((row) =>
        whereFromObject(row, { id: activityId }),
      )
        .update({ title })
        .then(requireDatabaseRow)
    : prisma.orm.public.BonusActivity.where((row) =>
        whereFromObject(row, { id: activityId }),
      )
        .update({ title })
        .then(requireDatabaseRow);
}
