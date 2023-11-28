import { prisma } from "../../utils/db";

export default async function putReleaseCourses(
  coursesIds: number[],
  moduleId: number
) {
  const transaction = await prisma.$transaction(async (tx) => {
    for (const courseId of coursesIds) {
      if (courseId) {
        await tx.coursesOnModule.deleteMany({
          where: { courseId, moduleId },
        });
      }
    }
  });
  return transaction;
}
