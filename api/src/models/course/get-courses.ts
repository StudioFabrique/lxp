import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function getCourses(scope: AccessScope = null) {
  const query = scope
    ? prisma.orm.public.Course.where((row) =>
        row.module.some((module) =>
          scope.moduleIds === null
            ? module.parcoursId.in(scope.parcoursIds)
            : module.id.in(scope.moduleIds),
        ),
      )
    : prisma.orm.public.Course;
  const courses = await query
    .select("id", "title", "author", "updatedAt", "isPublished", "visibility")
    .include("module", (related54) =>
      related54
        .select("id", "title")
        .include("parcours", (related55) => related55.select("title")),
    )
    .include("lessons", (related56) =>
      related56
        .select("id", "title", "order", "visibility")
        .orderBy((row) => row.order.asc()),
    )
    .all();

  const result = courses.map((item) => ({
    id: item.id,
    title: item.title,
    moduleId: item.module!.id,
    module: item.module!.title,
    parcours: item.module!.parcours!.title,
    author: item.author,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    lessons: item.lessons,
  }));

  return result;
}

export default getCourses;
