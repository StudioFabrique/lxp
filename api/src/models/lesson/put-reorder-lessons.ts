import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default async function putReorderLessons(
  courseId: number,
  lessonsId: number[],
) {
  const existingCourse = await prisma.orm.public.Course.where({
    id: courseId,
  }).first();

  if (!existingCourse) {
    const error: any = { message: "Le cours n'existe pas.", statusCode: 404 };
    throw error;
  }

  const transaction = await prisma.transaction(async (tx) => {
    let i = 0;
    for (const id of lessonsId) {
      await tx.orm.public.Lesson.where({ id })
        .update({ order: i })
        .then(requireDatabaseRow);
      i += 1;
    }
  });
  return transaction;
}
