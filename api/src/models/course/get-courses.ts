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
          description: true,
          thumb: true,
          parcours: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },

      author: true,
      createdAt: true,
      updatedAt: true,
      isPublished: true,
      visibility: true,
    },
  });

  const result = courses.map((item) => ({
    id: item.id,
    title: item.title,
    moduleId: item.module.id,
    parcoursId: item.module.parcours.id,
    module: item.module.title,
    parcours: item.module.parcours.title,
    author: item.author,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    thumb: item.module.thumb
      ? Buffer.from(item.module.thumb as any).toString("base64")
      : null,
  }));

  return result;
}

export default getCourses;
