import { prisma } from "../../utils/db";

async function getCoursesByModule(moduleId: number) {
  const courses = await prisma.course.findMany({
    where: {
      moduleId,
    },
    select: {
      id: true,
      title: true,
      module: {
        select: {
          id: true,
          title: true,
          thumb: true,
          parcours: {
            select: {
              parcours: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      lessons: { select: { id: true } },
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
    module: item.module.title,
    parcours: item.module.parcours[0].parcours.title,
    lessons: item.lessons,
    author: item.author,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    thumb: item.module.thumb?.toString("base64") ?? null,
  }));

  return result;
}

export default getCoursesByModule;
