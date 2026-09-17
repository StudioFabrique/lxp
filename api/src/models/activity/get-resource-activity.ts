import type {
  Activity,
  BonusActivity,
  ResourceActivity,
  ResourceBonusActivity,
} from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";

export default async function getResourceActivity(
  activityId: number,
  parent: "resource" | "lesson",
) {
  let activity: Activity | BonusActivity | null = null;

  if (parent === "lesson")
    activity = await prisma.orm.public.Activity.where({
      id: activityId,
    }).first();
  else {
    activity = await prisma.orm.public.BonusActivity.where({
      id: activityId,
    }).first();
  }

  if (!activity) throw { statusCode: 404, message: "L'activité n'existe pas." };

  let resources: ResourceActivity[] | ResourceBonusActivity[] | null = null;

  if (parent === "lesson")
    resources = await prisma.orm.public.ResourceActivity.where({ activityId })
      .orderBy((row) => row.order.asc())
      .all();
  else {
    resources = await prisma.orm.public.ResourceBonusActivity.where({
      bonusActivityId: activityId,
    })
      .orderBy((row) => row.order.asc())
      .all();
  }
  return resources;
}
