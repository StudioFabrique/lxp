import { prisma } from "../../utils/db.ts";
import {
  assertCanUnassignTags,
  type TagActor,
} from "../tag/tag-access.ts";

async function putParcoursTags(
  parcoursId: number,
  newTags: Array<number>,
  actor: TagActor,
) {
  const tagIds = [...new Set(newTags)];

  // on verifie l'existence du parcours et on récupère les tags de la formation avec laquelle il est en relation
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
    include: {
      formation: {
        include: { tags: true },
      },
      tags: {
        select: {
          tagId: true,
          addedBy: true,
        },
      },
    },
  });

  if (!existingParcours) {
    throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
  }

  const existingTagsCount = await prisma.tag.count({
    where: { id: { in: tagIds } },
  });
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
  await prisma.$transaction(async (tx) => {
    await tx.tagsOnFormation.createMany({
      data: tagIds.map((tagId) => ({
        tagId,
        formationId: existingParcours.formation.id,
      })),
      skipDuplicates: true,
    });

    if (removedTagIds.length > 0) {
      await tx.tagsOnParcours.deleteMany({
        where: { parcoursId, tagId: { in: removedTagIds } },
      });
    }

    if (addedTagIds.length > 0) {
      await tx.tagsOnParcours.createMany({
        data: addedTagIds.map((tagId) => ({
          parcoursId,
          tagId,
          addedBy: actor.isAdmin ? null : actor.userId,
        })),
      });
    }

    await tx.parcours.update({
      where: { id: parcoursId },
      data: { updatedAt: new Date() },
    });
  });
}

export default putParcoursTags;
