import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default async function putReorderCourses(
  moduleId: number,
  coursesId: number[],
) {
  const existingModule = await prisma.orm.public.Module.where({
    id: moduleId,
  }).first();

  if (!existingModule) {
    throw { message: "Le module n'existe pas.", statusCode: 404 };
  }

  const transaction = await prisma.transaction(async (tx) => {
    let i = 0;
    for (const id of coursesId) {
      await tx.orm.public.Course.where({ id })
        .update({ order: i })
        .then(requireDatabaseRow);
      i += 1;
    }
  });
  return transaction;
}
