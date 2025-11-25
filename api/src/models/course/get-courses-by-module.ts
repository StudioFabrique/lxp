import { prisma } from "../../utils/db";

async function getCoursesByModule(moduleId: number) {
  const courses = await prisma.course.findMany({
    where: {
      moduleId,
      isPublished: true,
      visibility: true,
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
          module: {
            select: {
              title: true,
              description: true,
              thumb: true,
              id: true,
            },
          },
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
    module: item.module.module.title,
    parcours: item.module.parcours.title,
    lessons: item.lessons,
    author: item.author,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    thumb:
      Buffer.from(item.module.module.thumb as any).toString("base64") ?? null,
  }));

  return result;
}

export default getCoursesByModule;
