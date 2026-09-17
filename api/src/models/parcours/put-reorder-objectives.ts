import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";

export default async function putReorderObjectives(
  parcoursId: string,
  objectiveIds: number[],
) {
  const id = Number(parcoursId);
  return prisma.transaction(async (tx) => {
    const parcours = await tx.orm.public.Parcours.where({ id })
      .select("id")
      .first();
    if (!parcours) {
      throw { message: "Le parcours n'existe pas", status: 404 };
    }

    const objectives = await tx.orm.public.Objective.where((row) =>
      and(row.parcoursId.eq(id), row.id.in(objectiveIds)),
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

    await tx.orm.public.Objective.where({ parcoursId: id }).deleteAndCount();
    for (const objectiveId of objectiveIds) {
      await tx.orm.public.Objective.create({
        parcoursId: id,
        description: descriptions.get(objectiveId)!,
      });
    }

    return tx.orm.public.Parcours.where({ id })
      .include("objectives", (related) =>
        related.select("id", "description").orderBy((row) => row.id.asc()),
      )
      .first();
  });
}
