import { Lesson } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putLesson(lesson: Lesson) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: +lesson.id },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const updatedLesson = await prisma.lesson.update({
    where: { id: +lesson.id },
    data: {
      ...lesson,
      id: +lesson.id,
    },
  });

  return updatedLesson;
}

export default putLesson;
