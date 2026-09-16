import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function deleteFormation(formationId: number) {
  return prisma.transaction(async (transaction) => {
    const formation = await transaction.orm.public.Formation.where((row) =>
      whereFromObject(row, { id: formationId }),
    )
      .select("id", "title")
      .first();

    if (!formation) {
      throw {
        statusCode: 404,
        message: "La formation n'existe pas.",
      };
    }

    const linkedParcours = await transaction.orm.public.Parcours.where((row) =>
      whereFromObject(row, { formationId }),
    )
      .select("id")
      .first();
    if (linkedParcours) {
      throw {
        statusCode: 409,
        message:
          "Cette formation ne peut pas être supprimée car des parcours y sont associés.",
      };
    }

    await transaction.orm.public.TagsOnFormation.where((row) =>
      whereFromObject(row, { formationId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));
    await transaction.orm.public.Formation.where((row) =>
      whereFromObject(row, { id: formationId }),
    )
      .delete()
      .then(requireDatabaseRow);
    return formation.title;
  });
}
