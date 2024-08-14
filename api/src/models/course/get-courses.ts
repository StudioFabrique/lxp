import { prisma } from "../../utils/db";

async function getCourses() {
  const courses = await prisma.course.findMany({
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
    author: item.author,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isPublished: item.isPublished,
    visibility: item.visibility,
    thumb: item.module.thumb.toString("base64"),
  }));

  return result;
}

export default getCourses;
