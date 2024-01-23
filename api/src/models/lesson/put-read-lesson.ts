export default async function putReadLesson(lessonId: number, userId: string) {
  const lesson = prisma?.lesson.update({
    where: { id: lessonId },
    data: { readBy: { push: userId } },
  });

  return lesson;
}
