import { prisma } from "../../utils/db";

async function getCourseSkills(courseId: number) {
  const skills = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      bonusSkills: {
        select: {
          bonusSkill: true,
        },
      },
      modules: {
        select: {
          module: {
            select: {
              bonusSkills: {
                select: {
                  bonusSkill: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!skills) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  return skills;
}

export default getCourseSkills;
