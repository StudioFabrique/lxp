import { prisma } from "../../utils/db";

export default async function getActivity(activityId: number) {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId },
    select: {
      id: true,
      type: true,
      order: true,
      lessonId: true,
      url: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!activity) throw { statusCode: 404, message: "L'activité n'existe pas." };

  console.log({ activity });

  return activity;
}
