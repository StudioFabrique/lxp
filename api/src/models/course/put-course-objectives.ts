import { prisma } from "../../utils/db";

async function putCourseObjectives(courseId: number, objectivesIds: number[]) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.objectivesOnCourse.deleteMany({
      where: { courseId },
    });

    const updatedCourse = await tx.course.update({
      where: { id: courseId },
      data: {
        objectives: {
          create: objectivesIds.map((id: number) => {
            return {
              objective: {
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

export default putCourseObjectives;
