import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default async function putLessonAvailability(
  id: number,
  update: { visibility: boolean },
) {
  const lesson = await prisma.orm.public.Lesson.where({ id }).first();
  if (!lesson) throw { statusCode: 404, message: "La leçon n'existe pas." };
  return prisma.orm.public.Lesson.where({ id })
    .update(update)
    .then(requireDatabaseRow);
}
