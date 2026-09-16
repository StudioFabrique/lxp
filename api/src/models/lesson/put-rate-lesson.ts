import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function putRateLesson(
  lessonId: number,
  userIdMdb: string,
  rating: number,
) {
  const student = await prisma.orm.public.Student.where((row) =>
    whereFromObject(row, { idMdb: userIdMdb }),
  ).first();

  if (!student) {
    return null;
  }

  const existingLessonRating = await prisma.orm.public.LessonRating.where(
    (row) => whereFromObject(row, { lessonId, studentId: student.id }),
  ).first();

  if (!existingLessonRating) return null;

  // Mettre à jour la notation existante
  const lessonRating = await prisma.orm.public.LessonRating.where((row) =>
    whereFromObject(row, {
      id: existingLessonRating.id,
    }),
  )
    .update({ rating: +rating })
    .then(requireDatabaseRow);

  return lessonRating;
}
