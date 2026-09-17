import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function getLessonRating(
  lessonId: number,
  userIdMdb: string,
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

  return existingLessonRating;
}
