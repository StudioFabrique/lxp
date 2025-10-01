import { prisma } from "../../utils/db";

async function getCourseObjectives(courseId: number) {
  const objectives = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      objectives: {
        select: {
          objective: true,
        },
      },
      module: {
        select: {
          parcours: {
            select: {
              objectives: true,
            },
          },
        },
      },
    },
  });

  if (!objectives) throw { message: "Le cours n'existe pas.", statusCode: 404 };

  return objectives;
}

export default getCourseObjectives;
