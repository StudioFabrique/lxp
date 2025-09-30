import { prisma } from "../../../utils/db";

export default async function getStudentParcoursWithAccomplishments(
  studentMdbId: string
) {
  // return a parcours instead of accomplishment

  const parcoursWithAccomplishments = await prisma.parcours.findMany({
    where: {
      modules: {
        some: {
          moduleMetadata: {
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
          moduleMetadata: {
            select: {
              id: true,
              module: { select: { title: true } },
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
      id: mod.moduleMetadata.id,
      title: mod.moduleMetadata.module.title,
      courses: mod.moduleMetadata.courses.map((course) => ({
        id: course.id,
        title: course.title,
        accomplishments: course.accomplishments,
      })),
    })),
  }));

  return formattedParcours;
}
