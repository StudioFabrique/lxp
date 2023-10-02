import { prisma } from "../../utils/db";

async function getCourseInformations(courseId: number) {
  const course = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
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
                  virtualClass: true,
                  tags: {
                    select: {
                      tag: {
                        select: {
                          id: true,
                          color: true,
                          name: true,
                        },
                      },
                    },
                  },
                  contacts: {
                    select: {
                      contact: {
                        select: {
                          id: true,
                          name: true,
                          role: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  return course;
}

export default getCourseInformations;
