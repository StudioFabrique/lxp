import { prisma } from "../../utils/db";

export default async function getResourceActivity(activityId: number) {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId },
  });

  if (!activity) throw { statusCode: 404, message: "L'activité n'existe pas." };

  const resources = await prisma.resourceActivity.findMany({
    where: { activityId },
    orderBy: {
      order: "asc",
    },
  });
  return resources;
}
