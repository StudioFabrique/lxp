import { prisma } from "../../utils/db";

async function deleteCourseLesson(courseId: number, lessonId: number) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const count = await tx.lessonsOnCourse.count({
      where: { lessonId },
    });
    await tx.lessonsOnCourse.deleteMany({
      where: { AND: [{ courseId }, { lessonId }] },
    });
    if (count === 1) {
      await tx.lesson.delete({
        where: { id: lessonId },
      });
    }
  });

  return transaction;
}

export default deleteCourseLesson;
