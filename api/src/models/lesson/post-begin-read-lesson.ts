export default async function postBeginReadLesson(
  lessonId: number,
  userIdMdb: string
) {
  const student = await prisma?.student.findFirst({
    where: { idMdb: userIdMdb },
  });

  if (!student) {
    return null;
  }

  const existingLessonRead = await prisma?.lessonRead.findFirst({
    where: { lessonId, studentId: student.id },
  });

  if (existingLessonRead) {
    const updatedExistingLessonRead = await prisma?.lessonRead.update({
      where: { id: existingLessonRead.id },
      data: { lastOpenedAt: new Date() },
    });
    return updatedExistingLessonRead;
  }

  const lessonRead = await prisma?.lessonRead.create({
    data: { lessonId, studentId: student.id },
  });

  if (!lessonRead) {
    return null;
  }

  return lessonRead;
}
