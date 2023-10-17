import { prisma } from "../../utils/db";

async function getCourseScenario(courseId: number) {
  const scenario = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      scenario: true,
      lessons: {
        select: {
          lesson: {
            select: {
              id: true,
              title: true,
              description: true,
              modalite: true,
              createdAt: true,
              updatedAt: true,
              tag: true,
            },
          },
        },
      },
    },
  });

  if (!scenario) {
    const error = new Error(
      "Le cours n'existe pas ou n'a aucun scénario associé"
    );
    (error as any).statusCode = 404;
    throw error;
  }

  return scenario;
}

export default getCourseScenario;
