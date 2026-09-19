import type { Lesson } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

async function putCourseLesson(
  courseId: number,
  lessonData: any,
  adminId: string,
) {
  const tagId = Number(lessonData.tagId);
  const existingCourse = await prisma.orm.public.Course.where({ id: courseId })
    .include("lessons")
    .include("tags", (related61) => related61.select("tagId"))
    .first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  if (!existingCourse.tags.some((tag) => tag.tagId === tagId)) {
    const error = new Error("Le tag doit être associé au cours");
    (error as any).statusCode = 400;
    throw error;
  }

  const prismaAdmin = await prisma.orm.public.Admin.where({ idMdb: adminId })
    .select("id")
    .first();

  if (!prismaAdmin) {
    const error = new Error("L'auteur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAdmin = await User.findOne(
    { _id: adminId },
    { firstname: 1, lastname: 1 },
  );

  if (!existingAdmin) {
    const error = new Error("L'auteur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let newLesson: Lesson | null = null;

  const transaction = await prisma.transaction(async (tx) => {
    newLesson = await tx.orm.public.Lesson.select(
      "id",
      "title",
      "description",
      "modalite",
      "createdAt",
      "updatedAt",
      "duplicationIndex",
      "tagId",
      "author",
      "adminId",
      "courseId",
      "visibility",
      "order",
    )
      .include("tag")
      .create({
        title: lessonData.title,
        description: lessonData.description ?? "",
        modalite: lessonData.modalite,
        author: `${existingAdmin.firstname} ${existingAdmin.lastname}`,
        order: existingCourse.lessons.length,
        visibility: true,
        tag: (relation) => relation.connect({ id: tagId }),
        admin: (relation) => relation.connect({ id: prismaAdmin.id }),
        course: (relation) => relation.connect({ id: courseId }),
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
