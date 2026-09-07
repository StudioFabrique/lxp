import { prisma } from "../../utils/db.ts";
import {
  assertCanManageTags,
  type TagActor,
} from "../tag/tag-access.ts";

async function putParcoursTags(
  parcoursId: number,
  newTags: Array<number>,
  actor: TagActor,
) {
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
          tag: { select: { createdBy: true } },
        },
      },
    },
  });

  if (!existingParcours) {
    throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
  }

  if (!actor.isAdmin) {
    const requestedTagIds = new Set(newTags);
    const removedTags = existingParcours.tags
      .filter(({ tagId }) => !requestedTagIds.has(tagId))
      .map(({ tag }) => tag);
    assertCanManageTags(
      removedTags,
      actor,
      "Vous ne pouvez pas désassigner un tag créé par un administrateur ou une autre équipe pédagogique.",
    );
  }

  // on met à jour les tags du parcours
  await prisma.$transaction(async (tx) => {
    await tx.tagsOnFormation.createMany({
      data: newTags.map((tagId) => ({
        tagId,
        formationId: existingParcours.formation.id,
      })),
      skipDuplicates: true,
    });

    await tx.tagsOnParcours.deleteMany({
      where: { parcoursId },
    });

    await tx.parcours.update({
      where: { id: parcoursId },
      data: {
        tags: {
          create: newTags.map((tag: number) => {
            return {
              tag: {
                connect: { id: tag },
              },
            };
          }),
        },
      },
      include: { tags: true },
    });
  });
}

export default putParcoursTags;
