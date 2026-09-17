import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma, type NestedConnect } from "../../utils/db.ts";

async function putCourseTags(courseId: number, tags: number[]) {
  if (!tags.length) {
    const error = new Error("Au moins un tag doit être associé au cours");
    (error as any).statusCode = 400;
    throw error;
  }

  const existingCourse = await prisma.orm.public.Course.where({
    id: courseId,
  }).first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.transaction(async (tx) => {
    await tx.orm.public.TagsOnCourse.where({ courseId })
      .deleteAndCount()
      .then((count) => ({ count }));

    const updatedCourse = await tx.orm.public.Course.where({ id: courseId })
      .update({
        tags: (relation) =>
          relation.create(
            tags.map((tag: number) => {
              return {
                tag: (tagRelation: NestedConnect<"Tag">) =>
                  tagRelation.connect({ id: tag }),
              };
            }),
          ),
      })
      .then(requireDatabaseRow);
    return updatedCourse;
  });
  return transaction;
}

export default putCourseTags;
