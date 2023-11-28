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

  const response = courses.map((course) => {
    return {
      ...course,
      modules: course.modules.map((item) => ({
        ...item.module,
        parcours: item.module.parcours[0].parcours,
      })),
    };
  });

  return response;
}

export default getCourses;
