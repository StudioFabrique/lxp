import { prisma } from "../../utils/db";

type LessonUpdateData = {
  id: number;
  title: string;
  description?: string | null;
  modalite: string;
  tagId: number;
};

async function putLesson(lesson: LessonUpdateData) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: +lesson.id },
    select: {
      course: {
        select: { tags: { select: { tagId: true } } },
      },
    },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  if (
    !existingLesson.course.tags.some(({ tagId }) => tagId === +lesson.tagId)
  ) {
    throw { statusCode: 400, message: "Le tag doit être associé au cours." };
  }

  if (!["hybride", "distanciel", "presentiel"].includes(lesson.modalite))
    throw { statusCode: 400, message: "Modalité non reconnue." };

  return await prisma.lesson.update({
    where: { id: +lesson.id },
    data: {
      title: lesson.title,
      description: lesson.description ?? "",
      modalite: lesson.modalite,
      tagId: +lesson.tagId,
    },
    include: {
      tag: true,
    },
  });
}

export default putLesson;
