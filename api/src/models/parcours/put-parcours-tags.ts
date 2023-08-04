import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function putParcoursTags(parcoursId: number, newTags: Array<number>) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
    include: {
      formation: {
        include: { tags: true },
      },
    },
  });

  if (!existingParcours) {
    throw new Error(`Le parcours avec l'id ${parcoursId} n'existe pas`);
  }

  const tagsIds = existingParcours.formation.tags.map((item) => item.tagId);

  newTags.forEach(async (newTag: number) => {
    if (!tagsIds.includes(newTag)) {
      await prisma.formation.update({
        where: { id: existingParcours.formation.id },
        data: {
          tags: {
            create: { tag: { connect: { id: newTag } } },
          },
        },
      });
    }
  });

  await prisma.tagsOnParcours.deleteMany({
    where: { parcoursId },
  });

  const updatedParcours = await prisma.parcours.update({
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

  return updatedParcours;
}

export default putParcoursTags;
