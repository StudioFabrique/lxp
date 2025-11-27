import { prisma } from "../../utils/db";
import userBelongsToContacts from "../../utils/userBelongsToContacts";

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

  // throw an error when the current user not belonging to contacts in course or is not admin
  await userBelongsToContacts(
    userId,
    existingLesson.course.contacts.map((contact) => contact.contact),
    "Vous n'êtes pas autorisé à supprimer cette leçon."
  );

  const deleteResources = await prisma.$transaction([
    prisma.lessonRead.deleteMany({
      where: { lessonId: lessonId },
    }),
    prisma.lessonRating.deleteMany({
      where: { lessonId: lessonId },
    }),
    prisma.lesson.delete({
      where: { id: lessonId },
    }),
  ]);

  return deleteLesson;
}
