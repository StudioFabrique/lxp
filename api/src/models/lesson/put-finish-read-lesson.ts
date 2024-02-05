export default async function putFinishReadLesson(
  lessonId: number,
  userIdMdb: string
) {
  const lessonRead = await prisma?.lessonRead.findFirst({
    where: { lessonId, student: { idMdb: userIdMdb } },
  });

  console.log("start");

  if (!lessonRead) {
    return null;
  }

  if (Boolean(lessonRead.finishedAt)) {
    return lessonRead;
  }

  console.log("update");

  await prisma?.lessonRead.update({
    where: { id: lessonRead.id },
    data: { finishedAt: new Date() },
  });

  return lessonRead;
}
