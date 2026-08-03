import { prisma } from "../../utils/db";

async function putCourseTags(courseId: number, tags: number[]) {
  if (!tags.length) {
    const error = new Error("Au moins un tag doit être associé au cours");
    (error as any).statusCode = 400;
    throw error;
  }

  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.tagsOnCourse.deleteMany({
      where: { courseId },
    });

    const updatedCourse = await tx.course.update({
      where: { id: courseId },
      data: {
        tags: {
          create: tags.map((tag: number) => {
            return {
              tag: {
                connect: {
                  id: tag,
                },
              },
            };
          }),
        },
      },
    });
  });
  return transaction;
}

export default putCourseTags;
