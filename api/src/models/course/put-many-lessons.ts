import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

async function putManyLessons(courseId: number, lessonsIds: number[]) {
  const existingCourse = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { id: courseId }),
  ).first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.transaction(async (tx) => {
    const existingLessons = await tx.orm.public.Lesson.where((row) =>
      whereFromObject(row, {
        id: {
          in: lessonsIds,
        },
      }),
    ).all();

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

    await tx.orm.public.Lesson.createAndCount(lessonsCopy).then((count) => ({
      count,
    }));
  });

  return transaction;
}

export default putManyLessons;
