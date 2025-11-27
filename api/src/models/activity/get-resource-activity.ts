import {
  Activity,
  BonusActivity,
  ResourceActivity,
  ResourceBonusActivity,
} from "../../../generated/prisma/client";
import { prisma } from "../../utils/db";

export default async function getResourceActivity(
  activityId: number,
  parent: "resource" | "lesson",
) {
  let activity: Activity | BonusActivity | null = null;

  if (parent === "lesson")
    activity = await prisma.activity.findFirst({
      where: { id: activityId },
    });
  else {
    activity = await prisma.bonusActivity.findFirst({
      where: { id: activityId },
    });
  }

  if (!activity) throw { statusCode: 404, message: "L'activité n'existe pas." };

  let resources: ResourceActivity[] | ResourceBonusActivity[] | null = null;

  if (parent === "lesson")
    resources = await prisma.resourceActivity.findMany({
      where: { activityId },
      orderBy: {
        order: "asc",
      },
    });
  else {
    resources = await prisma.resourceBonusActivity.findMany({
      where: { bonusActivityId: activityId },
      orderBy: {
        order: "asc",
      },
    });
  }
  return resources;
}
