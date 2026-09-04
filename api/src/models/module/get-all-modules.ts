import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getAllModules(scope: AccessScope = null) {
  const modules = await prisma.module.findMany({
    where: moduleWhereForScope(scope),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      thumb: true,
      createdAt: true,
      parcoursId: true,
      parcours: {
        select: {
          title: true,
          formation: { select: { title: true } },
        },
      },
      courses: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
          isPublished: true,
          visibility: true,
          lessons: {
            orderBy: { order: "asc" },
            take: 1,
            select: { id: true },
          },
        },
      },
    },
  });

  return modules.map(({ parcours, courses, thumb, ...module }) => {
    const mappedCourses = courses.map(({ lessons, ...course }) => ({
      ...course,
      firstLessonId: lessons[0]?.id,
    }));

    return {
      ...module,
      thumb: thumb ? Buffer.from(thumb as any).toString("base64") : null,
      parcours: parcours.title,
      formation: parcours.formation.title,
      coursesCount: courses.length,
      courses: mappedCourses,
    };
  });
}
