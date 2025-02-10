import { prisma } from "../../utils/db";

export default async function postRateLesson(
  lessonId: number,
  userIdMdb: string,
  rating: number,
) {
  const student = await prisma.student.findFirst({
    where: { idMdb: userIdMdb },
  });

  if (!student) {
    return null;
  }

  const existingLessonRating = await prisma.lessonRating.findMany({
    where: { lessonId, studentId: student.id },
  });

  if (existingLessonRating) return null;

  // Créer une nouvelle notation lessonRating
  const lessonRating = await prisma.lessonRating.create({
    data: { lessonId, studentId: student.id, rating },
  });

  return lessonRating;
}
