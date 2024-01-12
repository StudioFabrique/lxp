import { prisma } from "../../utils/db";

export default async function putReorderCourses(
  moduleId: number,
  coursesId: number[]
) {
  const existingModule = await prisma.module.findFirst({
    where: { id: moduleId },
  });

  if (!existingModule) {
    const error: any = { message: "Le module n'existe pas.", statusCode: 404 };
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    let i = 0;
    for (const id of coursesId) {
      await tx.course.update({
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
