import { prisma } from "../../utils/db.ts";

export default async function getLessonRating(
  lessonId: number,
  userIdMdb: string,
) {
  const student = await prisma.student.findFirst({
    where: { idMdb: userIdMdb },
  });

  if (!student) {
    return null;
  }

  const existingLessonRating = await prisma.lessonRating.findFirst({
    where: { lessonId, studentId: student.id },
  });

  if (!existingLessonRating) return null;

  return existingLessonRating;
}
