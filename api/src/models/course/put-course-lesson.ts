import { Lesson } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putCourseLesson(courseId: number, lessonData: any) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let newLesson: Lesson | null = null;

  const transaction = await prisma.$transaction(async (tx) => {
    newLesson = await prisma.lesson.create({
      data: lessonData,
    });
    await tx.course.update({
      where: { id: courseId },
      data: {
        lessons: {
          create: {
            lesson: {
              connect: { id: newLesson.id },
            },
          },
        },
      },
    });
  });
  if (!newLesson) {
    const error = new Error("La leçon n'a pas pu être enregistrée");
    (error as any).statusCode = 500;
    throw error;
  }
  return newLesson;
}

export default putCourseLesson;
