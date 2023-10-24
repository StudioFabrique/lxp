import { prisma } from "../../utils/db";

async function getCourseInformations(courseId: number) {
  const course = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      virtualClass: true,
      visibility: true,
      dates: true,
      tags: {
        select: {
          tag: true,
        },
      },
      contacts: {
        select: {
          contact: true,
        },
      },
      module: {
        select: {
          id: true,
          title: true,
          minDate: true,
          maxDate: true,
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
          parcours: {
            select: {
              parcours: {
                select: {
                  id: true,
                  title: true,
                  virtualClass: true,
                  formation: {
                    select: {
                      id: true,
                      title: true,
                      tags: {
                        select: {
                          tag: true,
                        },
                      },
                    },
                  },
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

  if (course) {
    if (course.image instanceof Buffer) {
      const base64Image = course.image.toString("base64");
      const result = { ...course, image: base64Image };
      return result;
    }
  }

  return course;
}

export default getCourseInformations;
