import { prisma } from "../../utils/db";

import User from "../../utils/interfaces/db/user";

export default async function putFinishReadLesson(
  lessonId: number,
  userIdMdb: string
) {
  const student = await prisma.student.findFirst({
    where: { idMdb: userIdMdb },
  });

  const studentData = await User.findById(student?.idMdb);

  if (!student || !studentData) {
    return null;
  }

  const lessonRead = await prisma.lessonRead.findFirst({
    where: { lessonId, student },
    select: { id: true, finishedAt: true, lesson: { select: { title: true } } },
  });

  if (!lessonRead) {
    return null;
  }

  if (Boolean(lessonRead.finishedAt)) {
    return lessonRead;
  }

  const transactionResult = await prisma.$transaction([
    prisma.lessonRead.update({
      where: { id: lessonRead.id },
      data: { finishedAt: new Date() },
    }),
    prisma.accomplishment.create({
      data: {
        name: `${studentData.firstname} ${studentData.lastname}`,
        description: `vient de terminer la leçon ${lessonRead.lesson.title}`,
        student: { connect: { id: student.id } },
      },
    }),
  ]);

  return transactionResult?.[0];
}
