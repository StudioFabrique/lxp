import { whereFromObject } from "../../../utils/prisma-query.ts";
import { prisma } from "../../../utils/db.ts";

export default async function getStudentParcoursWithAccomplishments(
  studentMdbId: string,
) {
  // return a parcours instead of accomplishment

  const parcoursWithAccomplishments = await prisma.orm.public.Parcours.where(
    (row) =>
      whereFromObject(row, {
        modules: {
          some: {
            courses: {
              some: {
                accomplishments: { some: { student: { idMdb: studentMdbId } } },
              },
            },
          },
        },
      }),
  )
    .select("id", "title")
    .include("modules", (related43) =>
      related43
        .select("id", "title")
        .include("courses", (related44) =>
          related44
            .select("id", "title")
            .include("accomplishments", (related45) =>
              related45.select("id", "description", "accomplishedAt"),
            ),
        ),
    )
    .all();

  const formattedParcours = parcoursWithAccomplishments.map((parcours) => ({
    id: parcours.id,
    title: parcours.title,
    modules: parcours.modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      courses: mod.courses.map((course) => ({
        id: course.id,
        title: course.title,
        accomplishments: course.accomplishments,
      })),
    })),
  }));

  return formattedParcours;
}
