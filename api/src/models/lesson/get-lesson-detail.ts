import { prisma } from "../../utils/db";

export default async function getLessonDetail(lessonId: number) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  return existingLesson;
}
