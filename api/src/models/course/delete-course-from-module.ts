import { prisma } from "../../utils/db";
import userBelongsToContacts from "../../utils/userBelongsToContacts";

export default async function deleteCourse(courseId: number, userId: string) {
  //  récupération du cours à supprimer dans la bdd pour vérifier qu'il existe
  const existingCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
    include: {
      module: {
        select: {
          contacts: { select: { contact: { select: { idMdb: true } } } },
        },
      },
    },
  });

  //  si le cours n'existe pas on retourne une erreur
  if (!existingCourse)
    throw { statusCode: 404, message: "Le cours n'existe pas" };

  // throw an error when the current user not belonging to contacts in module or is not admin
  await userBelongsToContacts(
    userId,
    existingCourse.module.contacts.map((contact) => contact.contact),
    "Vous n'êtes pas autorisé à supprimer ce cours."
  );

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
