export default async function putFinishReadLesson(
  lessonId: number,
  userIdMdb: string
) {
  const student = await prisma?.student.findFirst({
    where: { idMdb: userIdMdb },
  });

  if (!student) {
    return null;
  }

  const lessonRead = await prisma?.lessonRead.findFirst({
    where: { lessonId, student },
    select: { id: true, finishedAt: true, lesson: { select: { title: true } } },
  });

  if (!lessonRead) {
    return null;
  }

  if (Boolean(lessonRead.finishedAt)) {
    return lessonRead;
  }

  const transactionResult = await prisma?.$transaction([
    prisma.lessonRead.update({
      where: { id: lessonRead.id },
      data: { finishedAt: new Date() },
    }),
    prisma.accomplishment.create({
      data: {
        description: `vient de terminer la leçon ${lessonRead.lesson.title}`,
        student: { connect: { id: student.id } },
      },
    }),
  ]);

  return transactionResult?.[0];
}
