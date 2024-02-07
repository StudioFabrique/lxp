import { LessonRead } from "@prisma/client";

export default async function getLastLessonsRead(userIdMdb: string) {
  const lessons = await prisma?.lessonRead.findMany({
    where: { student: { idMdb: userIdMdb }, finishedAt: null },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          course: {
            select: { title: true, module: { select: { title: true } } },
          },
        },
      },
    },
    orderBy: { beganAt: "desc" },
    take: 4,
  });

  if (lessons && !(lessons?.length > 0)) {
    const lesson = await prisma?.lesson.findFirst({
      where: {
        lessonsRead: { every: { NOT: { student: { idMdb: userIdMdb } } } },
      },
      include: {
        course: {
          select: { title: true, module: { select: { title: true } } },
        },
      },
    });

    const lessonReformated = {
      lesson: { id: lesson?.id, title: lesson?.title, course: lesson?.course },
    };

    return [lessonReformated];
  }

  return lessons;
}
