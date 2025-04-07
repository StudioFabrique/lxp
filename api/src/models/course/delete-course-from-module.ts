import { prisma } from "../../utils/db";

export default async function deleteCourse(
  courseId: number,
  userId: string,
  userRoles: any,
) {
  //  récupération du cours à supprimer dans la bdd pour vérifier qu'il existe
  const existingCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });

  //  si le cours n'existe pas on retourne une erreur
  if (!existingCourse)
    throw { statusCode: 404, message: "Le cours n'existe pas" };

  if (userRoles[0].rank > 1) {
    const existingAuthor = await prisma.admin.findFirst({
      where: {
        id: existingCourse.adminId,
      },
    });
    // retourne une erreur si l'utilisateur n'est pas l'auteur du cours
    if (existingAuthor?.idMdb !== userId)
      throw {
        statusCode: 406,
        message: "Vous n'êtes pas autorisé à supprimer ce cours.",
      };
  }

  // supression des évaluations des notations de leçons, des leçons lues, des leçons
  // et du cours dans la base de données
  await prisma.$transaction([
    prisma.lessonRating.deleteMany({
      where: {
        lesson: {
          courseId: courseId,
        },
      },
    }),
    prisma.lessonRead.deleteMany({
      where: {
        lesson: {
          courseId: courseId,
        },
      },
    }),
    prisma.lesson.deleteMany({
      where: {
        courseId: courseId,
      },
    }),
    prisma.course.delete({
      where: {
        id: courseId,
      },
    }),
  ]);
}
