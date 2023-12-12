import { prisma } from "../../utils/db";

export default async function getLessonDetail(lessonId: number) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      course: {
        select: {
          id: true,
          title: true,
          image: true,
        },
      },
    },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  console.log({ existingLesson });

  if (existingLesson.course && existingLesson.course.image) {
    if (existingLesson.course.image instanceof Buffer) {
      const base64Image = existingLesson.course.image.toString("base64");
      const result = {
        ...existingLesson,
        course: {
          ...existingLesson.course,
          image: base64Image,
        },
      };
      return result;
    }
  }

  return existingLesson;
}
