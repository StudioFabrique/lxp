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

  const lessonRead = await prisma?.lessonRead.create({
    data: { lessonId, studentId: student.id },
  });

  if (!lessonRead) {
    return null;
  }

  return lessonRead;
}
