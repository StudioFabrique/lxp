import { Lesson } from "@prisma/client";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function postDuplicateLesson(
  courseId: number,
  lessonId: number[],
  adminId: string
) {
  // Vérification que lessonId n'est pas vide
  if (!lessonId || lessonId.length === 0) {
    const error = new Error("Aucune leçon à dupliquer");
    (error as any).statusCode = 400;
    throw error;
  }

  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
    select: {
      lessons: {
        select: {
          title: true,
          order: true,
        },
      },
    },
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

  let newLessons: Lesson[] = [];

  await prisma.$transaction(async (tx) => {
    // Récupérer les leçons à copier avec leurs activités
    const lessonsToCopy = await tx.lesson.findMany({
      where: { id: { in: lessonId } },
      select: {
        title: true,
        description: true,
        modalite: true,
        tagId: true,
        activities: {
          select: {
            title: true,
            type: true,
            order: true,
            url: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lessonsToCopy || lessonsToCopy.length === 0) {
      throw { statusCode: 404, message: "Les leçons n'existent pas" };
    }

    // Vérifier qu'aucune leçon avec ces titres n'existe déjà dans le cours
    const titlesToCheck = lessonsToCopy.map((lesson) => lesson.title);
    const conflictingLessons = await tx.lesson.findMany({
      where: {
        courseId: courseId,
        title: { in: titlesToCheck },
      },
      select: { title: true },
    });

    if (conflictingLessons.length > 0) {
      const conflictingTitles = conflictingLessons
        .map((l) => l.title)
        .join(", ");
      throw {
        statusCode: 409,
        message: `Les leçons suivantes existent déjà dans ce cours : ${conflictingTitles}`,
      };
    }

    // Calculer le prochain ordre disponible
    const maxOrder =
      existingCourse.lessons.length > 0
        ? Math.max(...existingCourse.lessons.map((l) => l.order))
        : -1;

    // Créer les nouvelles leçons avec leurs activités
    newLessons = await Promise.all(
      lessonsToCopy.map((lessonData, index) =>
        tx.lesson.create({
          data: {
            title: lessonData.title,
            description: lessonData.description,
            modalite: lessonData.modalite,
            author: `${existingAdmin.firstname} ${existingAdmin.lastname}`,
            order: maxOrder + index + 1,
            tagId: lessonData.tagId,
            adminId: prismaAdmin.id,
            courseId: courseId,
            activities: {
              create: lessonData.activities.map((a) => ({
                title: a.title,
                type: a.type,
                order: a.order,
                url: a.url,
                authorId: prismaAdmin.id,
              })),
            },
          },
          include: {
            tag: true,
            activities: {
              orderBy: { order: "asc" },
            },
          },
        })
      )
    );
  });

  if (!newLessons || newLessons.length === 0) {
    const error = new Error("Les leçons n'ont pas pu être enregistrées");
    (error as any).statusCode = 500;
    throw error;
  }

  return newLessons.map((l) => ({ id: l.id, title: l.title }));
}
