import { prisma } from "../../utils/db";

export default async function getActivity(activityId: number) {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId },
  });

  if (!activity) throw { statusCode: 404, message: "L'activité n'existe pas." };

  return activity;
}
