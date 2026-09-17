import { prisma } from "../../utils/db.ts";

export default async function getActivity(activityId: number) {
  const activity = await prisma.orm.public.Activity.where({ id: activityId })
    .select(
      "id",
      "type",
      "order",
      "lessonId",
      "url",
      "title",
      "createdAt",
      "updatedAt",
    )
    .first();

  if (!activity) throw { statusCode: 404, message: "L'activité n'existe pas." };

  return activity;
}
