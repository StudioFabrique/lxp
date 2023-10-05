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
    },
  });

  if (!objectives) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }
  console.log(objectives.objectives);

  return objectives;
}

export default getCourseObjectives;
