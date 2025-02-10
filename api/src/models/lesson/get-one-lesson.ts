import { prisma } from "../../utils/db";
import { tags } from "../../utils/fixtures/data/data";

export default async function getOneLesson(lessonId: number) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: {
      title: true,
      id: true,
      description: true,
      modalite: true,
      tag: true,
      course: {
        select: {
          tags: {
            select: { tag: true },
          },
        },
      },
    },
  });

  if (!existingLesson)
    throw { statusCode: 404, message: "La leçon n'existe pas." };

  return {
    ...existingLesson,
    course: { tags: existingLesson.course.tags.map((tag) => tag.tag) },
  };
}
