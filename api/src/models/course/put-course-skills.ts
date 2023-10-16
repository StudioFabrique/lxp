import { prisma } from "../../utils/db";

async function putCourseBonusSkills(
  courseId: number,
  bonusSkillsIds: number[]
) {
  console.log({ bonusSkillsIds });

  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.bonusSkillOnCourse.deleteMany({
      where: { courseId },
    });

    const updatedCourse = await tx.course.update({
      where: { id: courseId },
      data: {
        bonusSkills: {
          create: bonusSkillsIds.map((id: number) => {
            return {
              bonusSkill: {
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

export default putCourseBonusSkills;
