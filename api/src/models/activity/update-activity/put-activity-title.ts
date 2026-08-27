import { prisma } from "../../../utils/db.ts";
import type { Activity, BonusActivity } from "@prisma/client";

/** Updates only the title of an activity attached to a lesson or resource. */
export default async function putActivityTitle(
  activityId: number,
  title: string,
  parent: "lesson" | "resource",
  userId: string,
) {
  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
    select: { id: true },
  });

  if (!existingAuthor) {
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  }

  const existingActivity: Activity | BonusActivity | null =
    parent === "lesson"
      ? await prisma.activity.findUnique({ where: { id: activityId } })
      : await prisma.bonusActivity.findUnique({ where: { id: activityId } });

  if (!existingActivity) {
    throw { statusCode: 404, message: "L'activité n'existe pas." };
  }

  return parent === "lesson"
    ? prisma.activity.update({
        where: { id: activityId },
        data: { title },
      })
    : prisma.bonusActivity.update({
        where: { id: activityId },
        data: { title },
      });
}
