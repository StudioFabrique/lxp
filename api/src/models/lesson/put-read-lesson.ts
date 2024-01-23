export default async function putReadLesson(lessonId: number, userId: string) {
  const lesson = await prisma?.lesson.findUnique({ where: { id: lessonId } });

  if (lesson?.readBy.includes(userId)) {
    return lesson;
  }

  await prisma?.lesson.update({
    where: { id: lesson?.id },
    data: { readBy: { push: userId } },
  });

  return lesson;
}
