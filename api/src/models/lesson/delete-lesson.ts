import { prisma } from "../../utils/db";

export default async function deleteLesson(lessonId: number) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const deletedLesson = await prisma.lesson.delete({
    where: { id: lessonId },
  });
  return deletedLesson;
}
