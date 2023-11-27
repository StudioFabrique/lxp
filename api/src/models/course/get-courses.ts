import { prisma } from "../../utils/db";

async function getCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      modules: {
        select: {
          module: {
            select: {
              id: true,
              title: true,
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
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return courses;
}

export default getCourses;
