import { prisma } from "../../utils/db.ts";
import userBelongsToContacts from "../../utils/userBelongsToContacts.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";

export default async function deleteLesson(userId: string, lessonId: number) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    include: {
      course: {
        select: {
          contacts: { select: { contact: { select: { idMdb: true } } } },
        },
      },
    },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  // Vérification des droits
  await userBelongsToContacts(
    userId,
    existingLesson.course.contacts.map((contact) => contact.contact),
    "Vous n'êtes pas autorisé à supprimer cette leçon.",
  );

  // Récupérer les activités avant de supprimer la leçon
  const activities = await prisma.activity.findMany({ where: { lessonId } });

  // Supprimer les activités
  for (const act of activities) {
    await deleteActivity(act.id, act.type, "lesson");
  }

  // Ouvrir la transaction pour nettoyer la leçon et le reste
  await prisma.$transaction(async (tx) => {
    await tx.lessonRead.deleteMany({
      where: { lessonId },
    });

    await tx.lessonRating.deleteMany({
      where: { lessonId },
    });

    await tx.lesson.delete({
      where: { id: lessonId },
    });
  });

  return true;
}
