import { prisma } from "../../../utils/db";

export default async function postVideo(
  lessonId: number,
  type: string,
  order: number,
  url: string
) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const createdActivity = await prisma.activity.create({
    data: {
      type,
      order,
      url,
      lesson: {
        connect: {
          id: lessonId,
        },
      },
    },
  });

  return createdActivity;
}
