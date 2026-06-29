import { prisma } from "../../utils/db";
import userBelongsToContacts from "../../utils/userBelongsToContacts";
import deleteLesson from "../lesson/delete-lesson";

export default async function deleteCourse(courseId: number, userId: string) {
  // Récupération du cours et des IDs de ses leçons
  const existingCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
    include: {
      lessons: {
        select: { id: true },
      },
      module: {
        select: {
          contacts: { select: { contact: { select: { idMdb: true } } } },
        },
      },
    },
  });

  // Si le cours n'existe pas on retourne une erreur
  if (!existingCourse) {
    throw { statusCode: 404, message: "Le cours n'existe pas" };
  }

  // Vérification des droits
  await userBelongsToContacts(
    userId,
    existingCourse.module.contacts.map((contact) => contact.contact),
    "Vous n'êtes pas autorisé à supprimer ce cours.",
  );

  // Suppression propre de chaque leçon (en cascade)
  for (const lesson of existingCourse.lessons) {
    await deleteLesson(userId, lesson.id);
  }

  // Suppression du cours dans la base de données
  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });

  return true;
}
