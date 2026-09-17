import { prisma } from "../../utils/db.ts";
import { whereFromObject } from "../../utils/prisma-query.ts";

export default async function putReorderObjectives(
  parcoursId: string,
  objectiveIds: number[],
) {
  const id = Number(parcoursId);
  return prisma.transaction(async (tx) => {
    const parcours = await tx.orm.public.Parcours.where((row) =>
      whereFromObject(row, { id }),
    )
      .select("id")
      .first();
    if (!parcours) {
      throw { message: "Le parcours n'existe pas", status: 404 };
    }

    const objectives = await tx.orm.public.Objective.where((row) =>
      whereFromObject(row, { parcoursId: id, id: { in: objectiveIds } }),
    )
      .select("id", "description")
      .all();
    const descriptions = new Map(
      objectives.map(({ id: objectiveId, description }) => [
        objectiveId,
        description,
      ]),
    );
    if (descriptions.size !== objectiveIds.length) {
      throw { message: "Objectif introuvable dans ce parcours", status: 404 };
    }

    await tx.orm.public.Objective.where((row) =>
      whereFromObject(row, { parcoursId: id }),
    ).deleteAndCount();
    for (const objectiveId of objectiveIds) {
      await tx.orm.public.Objective.create({
        parcoursId: id,
        description: descriptions.get(objectiveId)!,
      });
    }

    return tx.orm.public.Parcours.where((row) =>
      whereFromObject(row, { id }),
    )
      .include("objectives", (related) =>
        related.select("id", "description").orderBy((row) => row.id.asc()),
      )
      .first();
  });
}
