import { prisma } from "../../utils/db.ts";

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
      module: {
        select: {
          id: true,
          minDate: true,
          maxDate: true,
          duration: true,
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
          title: true,
          description: true,
          image: true,
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
  });

  if (!course) throw { message: "Le cours n'existe pas.", statusCode: 404 };

  return {
    ...course,
    module: {
      ...course.module,
      image: course.module.image
        ? Buffer.from(course.module.image as any).toString("base64")
        : null,
    },
  };
}

export default getCourseInformations;
