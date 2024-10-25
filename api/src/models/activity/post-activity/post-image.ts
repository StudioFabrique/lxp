import { prisma } from "../../../utils/db";

export default async function postImage(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  filename: string,
) {
  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });
  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: { activities: true },
  });
  if (!existingLesson)
    throw { statusCode: 404, message: "La leçon n'existe pas" };

  const newActivity = await prisma.activity.create({
    data: {
      title,
      description,
      lessonId,
      type: "image",
      url: filename,
      order:
        existingLesson.activities.length > 0
          ? existingLesson.activities.length
          : 0,
      authorId: existingUser.id,
    },
  });
  return newActivity;
}
