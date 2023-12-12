import { prisma } from "../../utils/db";

async function putManyLessons(courseId: number, lessonsIds: number[]) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const existingLessons = await tx.lesson.findMany({
      where: {
        id: {
          in: lessonsIds,
        },
      },
    });

    let lessonsCopy: any = [];
    for (const lesson of existingLessons) {
      lessonsCopy = [
        ...lessonsCopy,
        {
          ...lesson,
          title: `Copie de : ${lesson.title}`,
          courseId: existingCourse.id,
          id: undefined,
        },
      ];
    }

    await tx.lesson.createMany({
      data: lessonsCopy,
    });
  });

  return transaction;
}

export default putManyLessons;
