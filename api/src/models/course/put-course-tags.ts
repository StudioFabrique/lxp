import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

async function putCourseTags(courseId: number, tags: number[]) {
  if (!tags.length) {
    const error = new Error("Au moins un tag doit être associé au cours");
    (error as any).statusCode = 400;
    throw error;
  }

  const existingCourse = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { id: courseId }),
  ).first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.transaction(async (tx) => {
    await tx.orm.public.TagsOnCourse.where((row) =>
      whereFromObject(row, { courseId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));

    const updatedCourse = await tx.orm.public.Course.where((row) =>
      whereFromObject(row, { id: courseId }),
    )
      .update({
        tags: (relation) =>
          relation.create(
            tags.map((tag: number) => {
              return {
                tag: {
                  connect: {
                    id: tag,
                  },
                },
              };
            }),
          ),
      })
      .then(requireDatabaseRow);
  });
  return transaction;
}

export default putCourseTags;
