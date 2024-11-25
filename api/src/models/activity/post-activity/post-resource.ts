import { prisma } from "../../../utils/db";
import type { File } from "buffer";

export default async function postActivityResource(
  lessonId: number,
  userId: string,
  label: string,
  url: string,
  filenames: string[]
) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: { id: true, activities: true },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }
}
