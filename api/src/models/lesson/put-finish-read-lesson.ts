export default async function putFinishReadLesson(
  lessonId: number,
  userIdMdb: string
) {
  const lessonRead = await prisma?.lessonRead.findFirst({
    where: { lessonId, student: { idMdb: userIdMdb } },
  });

  if (!lessonRead) {
    return null;
  }

  if (Boolean(lessonRead.finishedAt)) {
    return lessonRead;
  }

  const lessonReadUpdated = await prisma?.lessonRead.update({
    where: { id: lessonRead.id },
    data: { finishedAt: new Date() },
  });

  return lessonReadUpdated;
}
