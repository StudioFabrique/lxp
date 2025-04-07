import { prisma } from "../../../utils/db";

export default async function getStudentParcoursWithAccomplishments(
  studentMdbId: string,
) {
  // return a parcours instead of accomplishment

  const parcoursWithAccomplishments = await prisma.parcours.findMany({
    where: {
      modules: {
        some: {
          module: {
            courses: {
              some: {
                accomplishments: { some: { student: { idMdb: studentMdbId } } },
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      modules: {
        select: {
          module: {
            select: {
              id: true,
              title: true,
              courses: {
                select: {
                  id: true,
                  title: true,
                  accomplishments: {
                    select: {
                      id: true,
                      description: true,
                      accomplishedAt: true,
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

  const formattedParcours = parcoursWithAccomplishments.map((parcours) => ({
    id: parcours.id,
    title: parcours.title,
    modules: parcours.modules.map((mod) => ({
      id: mod.module.id,
      title: mod.module.title,
      courses: mod.module.courses.map((course) => ({
        id: course.id,
        title: course.title,
        accomplishments: course.accomplishments,
      })),
    })),
  }));

  return formattedParcours;
}
