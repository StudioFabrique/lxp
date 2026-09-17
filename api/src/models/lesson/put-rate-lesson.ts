import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default async function putRateLesson(
  lessonId: number,
  userIdMdb: string,
  rating: number,
) {
  const student = await prisma.orm.public.Student.where({
    idMdb: userIdMdb,
  }).first();

  if (!student) {
    return null;
  }

  const existingLessonRating = await prisma.orm.public.LessonRating.where({
    lessonId,
    studentId: student.id,
  }).first();

  if (!existingLessonRating) return null;

  // Mettre à jour la notation existante
  const lessonRating = await prisma.orm.public.LessonRating.where({
    id: existingLessonRating.id,
  })
    .update({ rating: +rating })
    .then(requireDatabaseRow);

  return lessonRating;
}
