import { prisma } from "../../../utils/db";

export default async function postIframe(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  url: string
) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: { id: true, activities: true },
  });

  if (!existingLesson)
    throw { message: "L'id de la lesson n'existe pas", status: 404 };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const createdActivity = await prisma.activity.create({
    data: {
      title,
      order: existingLesson.activities.length,
      type: "iframe",
      lesson: {
        connect: { id: existingLesson!.id },
      },
      url,
      author: {
        connect: {
          id: existingAuthor.id,
        },
      },
    },
  });

  return createdActivity;
}
