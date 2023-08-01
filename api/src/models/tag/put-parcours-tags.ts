import { PrismaClient, Parcours, TagsOnParcours } from "@prisma/client";

const prisma = new PrismaClient();

async function putParcoursTags(parcoursId: number, newTags: Array<number>) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
    include: { tags: true },
  });

  if (!existingParcours) {
    throw new Error(`Le parcours avec l'id ${parcoursId} n'existe pas`);
  }

  await prisma.tagsOnParcours.deleteMany({
    where: { parcoursId },
  });

  // Update the parcours with the new tags by replacing the existing tags with the newTagsOnParcours array
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
