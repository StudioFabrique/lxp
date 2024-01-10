import { prisma } from "../../utils/db";

export default async function putReorderLessons(
  courseId: number,
  lessonsId: number[]
) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error: any = { message: "Le cours n'existe pas.", statusCode: 404 };
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    let i = 0;
    for (const id of lessonsId) {
      await tx.lesson.update({
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
