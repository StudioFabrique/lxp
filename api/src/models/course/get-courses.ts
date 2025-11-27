import { prisma } from "../../utils/db";

async function getCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      module: {
        select: {
          id: true,
          module: {
            select: { title: true, description: true, thumb: true, id: true },
          },
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
    module: item.module.module.title,
    parcours: item.module.parcours.title,
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

export default getCourses;
