import { prisma } from "../../utils/db";

async function putCourseTags(courseId: number, tags: number[]) {
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

    const upadtedCourse = await tx.course.update({
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
