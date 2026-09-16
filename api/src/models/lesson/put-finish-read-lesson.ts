import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

import User from "../../utils/interfaces/db/user.ts";

export default async function putFinishReadLesson(
  lessonId: number,
  userIdMdb: string,
) {
  const student = await prisma.orm.public.Student.where((row) =>
    whereFromObject(row, { idMdb: userIdMdb }),
  ).first();

  const studentData = await User.findById(student?.idMdb);

  if (!student || !studentData) {
    return [];
  }

  const lessonRead = await prisma.orm.public.LessonRead.where((row) =>
    whereFromObject(row, { lessonId, student }),
  )
    .select("id", "finishedAt")
    .include("lesson", (related134) => related134.select("title", "courseId"))
    .first();

  if (!lessonRead) {
    return null;
  }

  if (Boolean(lessonRead.finishedAt)) {
    return lessonRead;
  }

  return prisma.transaction(async (tx) => {
    const updated = await tx.orm.public.LessonRead.where((row) =>
      whereFromObject(row, { id: lessonRead.id }),
    )
      .update({ finishedAt: new Date().toISOString() })
      .then(requireDatabaseRow);
    await tx.orm.public.Accomplishment.create({
      name: `${studentData.firstname} ${studentData.lastname}`,
      description: `vient de terminer la leçon ${lessonRead.lesson!.title}`,
      student: (relation) => relation.connect({ id: student.id }),
      course: (relation) =>
        relation.connect({ id: lessonRead.lesson!.courseId }),
      showToOtherStudent: true,
    });
    return updated;
  });
}
