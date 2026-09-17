import { prisma } from "../../utils/db.ts";

async function getCoursesByModule(moduleId: number, userMdbId: string) {
  const teacherOrAdmin = await prisma.orm.public.Admin.where({
    idMdb: userMdbId,
  }).first();

  const courses = await prisma.orm.public.Course.where({
    moduleId,
    isPublished: teacherOrAdmin ? undefined : true,
    visibility: teacherOrAdmin ? undefined : true,
  })
    .select(
      "id",
      "title",
      "author",
      "createdAt",
      "updatedAt",
      "isPublished",
      "visibility",
    )
    .include("module", (related45) =>
      related45
        .select("id", "title", "description", "thumb")
        .include("parcours", (related46) => related46.select("id", "title")),
    )
    .include("lessons", (related47) =>
      related47.select("id").orderBy((row) => row.order.asc()),
    )
    .orderBy((row) => row.order.asc())
    .all();

  const result = courses.map((item) => ({
    id: item.id,
    title: item.title,
    module: item.module!.title,
    parcours: item.module!.parcours!.title,
    lessons: item.lessons,
    author: item.author,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    thumb: item.module!.thumb
      ? Buffer.from(item.module!.thumb as any).toString("base64")
      : null,
  }));

  return result;
}

export default getCoursesByModule;
