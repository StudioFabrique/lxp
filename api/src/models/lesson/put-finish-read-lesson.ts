import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

import User from "../../utils/interfaces/db/user.ts";

export default async function putFinishReadLesson(
  lessonId: number,
  userIdMdb: string,
) {
  const student = await prisma.orm.public.Student.where({
    idMdb: userIdMdb,
  }).first();

  const studentData = await User.findById(student?.idMdb);

  if (!student || !studentData) {
    return [];
  }

  const lessonRead = await prisma.orm.public.LessonRead.where({
    lessonId,
    studentId: student.id,
  })
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
    const updated = await tx.orm.public.LessonRead.where({ id: lessonRead.id })
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
