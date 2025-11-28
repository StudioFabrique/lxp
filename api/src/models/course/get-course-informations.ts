import { prisma } from "../../utils/db";

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
          module: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
            },
          },
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

  const { module: moduleNested, ...courseWithoutModule } = course.module;

  let image = moduleNested.image;

  return {
    ...course,
    module: {
      ...courseWithoutModule,
      title: moduleNested.title,
      description: moduleNested.description,
      image: moduleNested.image
        ? Buffer.from(image as any).toString("base64")
        : null,
    },
  };
}

export default getCourseInformations;
