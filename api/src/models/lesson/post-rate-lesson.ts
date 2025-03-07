import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function postRateLesson(
  lessonId: number,
  userIdMdb: string,
  rating: number,
) {
  const student = await prisma.student.findFirst({
    where: { idMdb: userIdMdb },
  });

  const studentData = await User.findById(student?.idMdb);

  if (!student || !studentData) {
    return [];
  }

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: { courseId: true, title: true },
  });

  if (!lesson) return null;

  const existingLessonRating = await prisma.lessonRating.findFirst({
    where: { lessonId, studentId: student.id },
    select: { id: true },
  });

  if (existingLessonRating) return null;

  const transactionResult = await prisma.$transaction([
    prisma.lessonRating.create({
      data: { lessonId, studentId: student.id, rating: +rating },
    }),
    prisma.accomplishment.create({
      data: {
        name: `${studentData.firstname} ${studentData.lastname}`,
        description: `vient d'attribuer une note de ${rating} sur 5 à la leçon ${lesson.title}`,
        student: { connect: { id: student.id } },
        course: { connect: { id: lesson.courseId } },
      },
    }),
  ]);

  return transactionResult[0];
}
