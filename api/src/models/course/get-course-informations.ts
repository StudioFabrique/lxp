import { prisma } from "../../utils/db";
import ResponseCourseInformations from "../../utils/interfaces/data/response-course-informations";
import ResponseCourse from "../../utils/interfaces/data/response-course-informations";

async function getCourseInformations(courseId: number) {
  const course = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      description: true,
      virtualClass: true,
      visibility: true,
      //dates: true,
      isPublished: true,
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
      modules: {
        select: {
          module: {
            select: {
              id: true,
              title: true,
              minDate: true,
              maxDate: true,
              image: true,
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
      },
    },
  });

  if (!course) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const response = {
    ...course,
    module: { ...course.modules[0].module },
    modules: null,
  };

  if (response.module && response.module.image instanceof Buffer) {
    const base64Image = response.module.image.toString("base64");
    const result = {
      ...response,
      module: { ...response.module, image: base64Image },
    };
    return result;
  }

  return course;
}

export default getCourseInformations;
