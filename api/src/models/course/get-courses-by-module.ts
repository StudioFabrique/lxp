import { prisma } from "../../utils/db.ts";

async function getCoursesByModule(moduleId: number, userMdbId: string) {
  const teacherOrAdmin = await prisma.admin.findFirst({
    where: { idMdb: userMdbId },
  });

  const courses = await prisma.course.findMany({
    where: {
      moduleId,
      isPublished: teacherOrAdmin ? undefined : true,
      visibility: teacherOrAdmin ? undefined : true,
    },

    select: {
      id: true,
      title: true,
      module: {
        select: {
          id: true,
          parcours: {
            select: {
              id: true,
              title: true,
            },
          },
          title: true,
          description: true,
          thumb: true,
        },
      },
      lessons: {
        select: {
          id: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      author: true,
      createdAt: true,
      updatedAt: true,
      isPublished: true,
      visibility: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  const result = courses.map((item) => ({
    id: item.id,
    title: item.title,
    module: item.module.title,
    parcours: item.module.parcours.title,
    lessons: item.lessons,
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

export default getCoursesByModule;
