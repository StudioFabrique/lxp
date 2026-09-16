import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

async function putFormationTags(formationId: number, newTags: number[]) {
  const existingFormation = await prisma.orm.public.Formation.where((row) =>
    whereFromObject(row, { id: formationId }),
  ).first();
  if (!existingFormation) {
    throw { message: "La formation n'existe pas", statusCode: 404 };
  }

  return prisma.transaction(async (tx) => {
    await tx.orm.public.TagsOnFormation.where((row) =>
      whereFromObject(row, { formationId }),
    ).deleteAndCount();
    const tagIds = [...new Set(newTags)];
    if (tagIds.length > 0) {
      await tx.orm.public.TagsOnFormation.createAndCount(
        tagIds.map((tagId) => ({ formationId, tagId })),
      );
    }
    return tx.orm.public.Formation.where((row) =>
      whereFromObject(row, { id: formationId }),
    )
      .include("tags")
      .first()
      .then(requireDatabaseRow);
  });
}

export default putFormationTags;
