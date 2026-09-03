import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

async function getCourses(scope: AccessScope = null) {
  const courses = await prisma.course.findMany({
    where:
      scope === null ? undefined : { module: moduleWhereForScope(scope) },
    select: {
      id: true,
      title: true,
      module: {
        select: {
          id: true,
          title: true,
          parcours: {
            select: {
              title: true,
            },
          },
        },
      },
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
      author: true,
      updatedAt: true,
      isPublished: true,
      visibility: true,
    },
  });

  const result = courses.map((item) => ({
    id: item.id,
    title: item.title,
    moduleId: item.module.id,
    module: item.module.title,
    parcours: item.module.parcours.title,
    author: item.author,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    lessons: item.lessons,
  }));

  return result;
}

export default getCourses;
