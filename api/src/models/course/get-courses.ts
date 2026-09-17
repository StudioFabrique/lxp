import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

async function getCourses(scope: AccessScope = null) {
  const courses = await prisma.orm.public.Course.where((row) =>
    whereFromObject(
      row,
      scope === null ? undefined : { module: moduleWhereForScope(scope) },
    ),
  )
    .select("id", "title", "author", "updatedAt", "isPublished", "visibility")
    .include("module", (related54) =>
      related54
        .select("id", "title")
        .include("parcours", (related55) => related55.select("title")),
    )
    .include("lessons", (related56) =>
      related56
        .select("id", "title", "order")
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
