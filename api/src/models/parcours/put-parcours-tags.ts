import { and } from "@prisma/orm-postgres/orm-client";
import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";
import { assertCanUnassignTags, type TagActor } from "../tag/tag-access.ts";

async function putParcoursTags(
  parcoursId: number,
  newTags: Array<number>,
  actor: TagActor,
) {
  const tagIds = [...new Set(newTags)];

  // on verifie l'existence du parcours et on récupère les tags de la formation avec laquelle il est en relation
  const existingParcours = await prisma.orm.public.Parcours.where({
    id: parcoursId,
  })
    .include("formation", (related18) => related18.include("tags"))
    .include("tags", (related19) => related19.select("tagId", "addedBy"))
    .first();

  if (!existingParcours) {
    throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
  }

  const existingTagsCount = await prisma.orm.public.Tag.where((row) =>
    row.id.in(tagIds),
  )
    .aggregate((aggregate) => ({ total: aggregate.count() }))
    .then(({ total }) => total);
  if (existingTagsCount !== tagIds.length) {
    throw { message: "Un ou plusieurs tags n'existent pas.", statusCode: 404 };
  }

  const requestedTagIds = new Set(tagIds);
  const currentTagIds = new Set(
    existingParcours.tags.map(({ tagId }) => tagId),
  );
  const removedAssignments = existingParcours.tags.filter(
    ({ tagId }) => !requestedTagIds.has(tagId),
  );
  if (!actor.isAdmin) {
    assertCanUnassignTags(removedAssignments, actor);
  }

  const removedTagIds = removedAssignments.map(({ tagId }) => tagId);
  const addedTagIds = tagIds.filter((tagId) => !currentTagIds.has(tagId));

  // on met à jour les tags du parcours
  await prisma.transaction(async (tx) => {
    const formationTagIds = new Set(
      existingParcours.formation!.tags.map(({ tagId }) => tagId),
    );
    const missingIds = tagIds.filter((tagId) => !formationTagIds.has(tagId));
    if (missingIds.length > 0) {
      await tx.orm.public.TagsOnFormation.createAndCount(
        missingIds.map((tagId) => ({
          tagId,
          formationId: existingParcours.formation!.id,
        })),
      );
    }

    if (removedTagIds.length > 0) {
      await tx.orm.public.TagsOnParcours.where((row) =>
        and(row.parcoursId.eq(parcoursId), row.tagId.in(removedTagIds)),
      )
        .deleteAndCount()
        .then((count) => ({ count }));
    }

    if (addedTagIds.length > 0) {
      await tx.orm.public.TagsOnParcours.createAndCount(
        addedTagIds.map((tagId) => ({
          parcoursId,
          tagId,
          addedBy: actor.isAdmin ? null : actor.userId,
        })),
      ).then((count) => ({ count }));
    }

    await tx.orm.public.Parcours.where({ id: parcoursId })
      .update({ updatedAt: new Date().toISOString() })
      .then(requireDatabaseRow);
  });
}

export default putParcoursTags;
