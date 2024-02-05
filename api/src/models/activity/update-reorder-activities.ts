import { prisma } from "../../utils/db";

export default async function updateReorderActrivities(
  lessonId: number,
  activitiesIds: number[]
) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
  });
  if (!existingLesson) {
    const error: any = { message: "La leçon n'existe pas.", statusCode: 404 };
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    let i = 0;
    for (const id of activitiesIds) {
      await tx.activity.update({
        where: { id },
        data: {
          order: i,
        },
      });
      i += 1;
    }
  });
  return transaction;
}
