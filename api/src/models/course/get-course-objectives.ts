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
      modules: {
        select: {
          module: {
            select: {
              parcours: {
                select: {
                  parcours: {
                    select: {
                      objectives: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  console.log("toto");

  if (!objectives) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let response = {};

  if (objectives.modules !== undefined) {
    response = {
      ...objectives,
      module: objectives.modules[0].module,
      modules: null,
    };
  } else {
    response = {
      ...objectives,
      module: null,
      modules: null,
    };
  }

  return response;
}

export default getCourseObjectives;
