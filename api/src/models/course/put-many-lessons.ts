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
    const updatedCourse = await tx.course.update({
      where: { id: courseId },
      data: {
        lessons: {
          create: lessonsIds.map((id: number) => {
            return {
              lesson: {
                connect: { id },
              },
            };
          }),
        },
      },
    });
  });
  return transaction;
}

export default putManyLessons;
