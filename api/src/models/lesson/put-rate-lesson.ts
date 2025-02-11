import { prisma } from "../../utils/db";

export default async function putRateLesson(
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

  const existingLessonRating = await prisma.lessonRating.findFirst({
    where: { lessonId, studentId: student.id },
  });

  if (!existingLessonRating) return null;

  // Mettre à jour la notation existante
  const lessonRating = await prisma.lessonRating.update({
    where: {
      id: existingLessonRating.id,
    },
    data: {
      rating: +rating,
    },
  });

  return lessonRating;
}
