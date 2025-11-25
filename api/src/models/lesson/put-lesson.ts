import { Lesson } from "../../../generated/prisma/client";
import { prisma } from "../../utils/db";

async function putLesson(lesson: Lesson) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: +lesson.id },
    select: { tag: true },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const tag = await prisma.tag.findFirst({
    where: { id: +lesson.tagId },
  });

  if (!tag) throw { statusCode: 404, message: "Le tag n'existe pas." };

  if (!["hybride", "distanciel", "presentiel"].includes(lesson.modalite))
    throw { statusCode: 400, message: "Modalité non reconnue." };

  return await prisma.lesson.update({
    where: { id: +lesson.id },
    data: {
      ...lesson,
      id: +lesson.id,
    },
    include: {
      tag: true,
    },
  });
}

export default putLesson;
