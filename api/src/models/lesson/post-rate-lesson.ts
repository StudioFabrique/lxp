import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function postRateLesson(
  lessonId: number,
  userIdMdb: string,
  rating: number,
) {
  const student = await prisma.orm.public.Student.where((row) =>
    whereFromObject(row, { idMdb: userIdMdb }),
  ).first();

  const studentData = await User.findById(student?.idMdb);

  if (!student || !studentData) {
    return [];
  }

  const lesson = await prisma.orm.public.Lesson.where((row) =>
    whereFromObject(row, { id: lessonId }),
  )
    .select("courseId", "title")
    .first();

  if (!lesson) return null;

  const existingLessonRating = await prisma.orm.public.LessonRating.where(
    (row) => whereFromObject(row, { lessonId, studentId: student.id }),
  )
    .select("id")
    .first();

  if (existingLessonRating) return null;

  return prisma.transaction(async (tx) => {
    const lessonRating = await tx.orm.public.LessonRating.create({
      lessonId,
      studentId: student.id,
      rating: +rating,
    });
    await tx.orm.public.Accomplishment.create({
      name: `${studentData.firstname} ${studentData.lastname}`,
      description: `vient d'attribuer une note de ${rating} sur 5 à la leçon ${lesson.title}`,
      student: (relation) => relation.connect({ id: student.id }),
      course: (relation) => relation.connect({ id: lesson.courseId }),
    });
    return lessonRating;
  });
}
