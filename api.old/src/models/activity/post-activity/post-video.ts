import { prisma } from "../../../utils/db";

export default async function postVideo(
  lessonId: number,
  userId: string,
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

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
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
      author: {
        connect: {
          id: existingAuthor.id,
        },
      },
    },
  });

  return createdActivity;
}
