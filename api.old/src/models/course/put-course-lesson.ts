import { Lesson } from "@prisma/client";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

async function putCourseLesson(
  courseId: number,
  lessonData: any,
  adminId: string
) {
  console.log({ lessonData });

  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const prismaAdmin = await prisma.admin.findFirst({
    where: { idMdb: adminId },
    select: { id: true },
  });

  if (!prismaAdmin) {
    const error = new Error("L'auteur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAdmin = await User.findOne(
    { _id: adminId },
    { firstname: 1, lastname: 1 }
  );

  if (!existingAdmin) {
    const error = new Error("L'auteur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let newLesson: Lesson | null = null;

  const transaction = await prisma.$transaction(async (tx) => {
    newLesson = await tx.lesson.create({
      data: {
        title: lessonData.title,
        description: lessonData.description,
        modalite: lessonData.modalite,
        author: `${existingAdmin.firstname} ${existingAdmin.lastname}`,
        tag: {
          connect: { id: lessonData.tagId },
        },
        admin: {
          connect: { id: prismaAdmin.id },
        },
        course: {
          connect: { id: courseId },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        modalite: true,
        createdAt: true,
        updatedAt: true,
        tag: true,
        tagId: true,
        author: true,
        adminId: true,
        courseId: true,
        isPublished: true,
        visibility: true,
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
