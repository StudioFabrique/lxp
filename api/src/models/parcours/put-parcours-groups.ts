import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import type { Group } from "../../prisma/model-types.ts";
import { prisma, type NestedConnect } from "../../utils/db.ts";

async function putParcoursGroups(parcoursId: number, groupsIds: string[]) {
  const groups = await prisma.orm.public.Group.where((row) =>
    row.idMdb.in(groupsIds.map((item: string) => item)),
  ).all();

  const existingParcours = await prisma.orm.public.Parcours.where({
    id: parcoursId,
  }).first();

  if (!existingParcours) {
    const error = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw error;
  }

  let updatedParcours: any = {};

  const transaction = await prisma.transaction(async (tx) => {
    await tx.orm.public.GroupsOnParcours.where({
      parcoursId,
    })
      .deleteAndCount()
      .then((count) => ({ count }));
    updatedParcours = await tx.orm.public.Parcours.where({ id: parcoursId })
      .include("groups", (related16) =>
        related16.include("group", (related17) =>
          related17.select("id", "idMdb"),
        ),
      )
      .update({
        groups: (relation) =>
          relation.create(
            groups.map((group: Group) => {
              return {
                group: (groupRelation: NestedConnect<"Group">) =>
                  groupRelation.connect({ id: group.id }),
              };
            }),
          ),
      })
      .then(requireDatabaseRow);
  });

  return updatedParcours;
}

export default putParcoursGroups;
