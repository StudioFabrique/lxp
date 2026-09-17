import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

type LessonUpdateData = {
  id: number;
  title: string;
  description?: string | null;
  modalite: string;
  tagId: number;
};

async function putLesson(lesson: LessonUpdateData) {
  const existingLesson = await prisma.orm.public.Lesson.where({
    id: +lesson.id,
  })
    .include("course", (related135) =>
      related135.include("tags", (related136) => related136.select("tagId")),
    )
    .first();

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  if (
    !existingLesson.course!.tags.some(({ tagId }) => tagId === +lesson.tagId)
  ) {
    throw { statusCode: 400, message: "Le tag doit être associé au cours." };
  }

  if (!["hybride", "distanciel", "presentiel"].includes(lesson.modalite))
    throw { statusCode: 400, message: "Modalité non reconnue." };

  return await prisma.orm.public.Lesson.where({ id: +lesson.id })
    .include("tag")
    .update({
      title: lesson.title,
      description: lesson.description ?? "",
      modalite: lesson.modalite,
      tagId: +lesson.tagId,
    })
    .then(requireDatabaseRow);
}

export default putLesson;
