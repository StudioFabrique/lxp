import { prisma } from "../../../utils/db";

export default async function getStudentParcoursWithAccomplishments(
  studentMdbId: string
) {
  // return a parcours instead of accomplishment

  const parcoursWithAccomplishments = await prisma.parcours.findMany({
    where: {
      modules: {
        some: {
          courses: {
            some: {
              accomplishments: { some: { student: { idMdb: studentMdbId } } },
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
  });

  const formattedParcours = parcoursWithAccomplishments.map((parcours) => ({
    id: parcours.id,
    title: parcours.title,
    modules: parcours.modules.map((mod) => ({
      id: mod.id,
      title: mod.module.title,
      courses: mod.courses.map((course) => ({
        id: course.id,
        title: course.title,
        accomplishments: course.accomplishments,
      })),
    })),
  }));

  return formattedParcours;
}
