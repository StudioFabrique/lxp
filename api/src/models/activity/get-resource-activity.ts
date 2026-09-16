import { whereFromObject } from "../../utils/prisma-query.ts";
import type { Activity, BonusActivity, ResourceActivity, ResourceBonusActivity } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";

export default async function getResourceActivity(
  activityId: number,
  parent: "resource" | "lesson",
) {
  let activity: Activity | BonusActivity | null = null;

  if (parent === "lesson")
    activity = await prisma.orm.public.Activity.where((row) =>
      whereFromObject(row, { id: activityId }),
    ).first();
  else {
    activity = await prisma.orm.public.BonusActivity.where((row) =>
      whereFromObject(row, { id: activityId }),
    ).first();
  }

  if (!activity) throw { statusCode: 404, message: "L'activité n'existe pas." };

  let resources: ResourceActivity[] | ResourceBonusActivity[] | null = null;

  if (parent === "lesson")
    resources = await prisma.orm.public.ResourceActivity.where((row) =>
      whereFromObject(row, { activityId }),
    )
      .orderBy((row) => row.order.asc())
      .all();
  else {
    resources = await prisma.orm.public.ResourceBonusActivity.where((row) =>
      whereFromObject(row, { bonusActivityId: activityId }),
    )
      .orderBy((row) => row.order.asc())
      .all();
  }
  return resources;
}
