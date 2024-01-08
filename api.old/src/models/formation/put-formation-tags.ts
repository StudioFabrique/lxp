import { prisma } from "../../utils/db";

async function putFormationTags(formationId: number, newTags: Array<number>) {
  const existingFormation = await prisma.formation.findUnique({
    where: { id: formationId },
  });

  if (!existingFormation) {
    throw new Error(`La formation avec l'id ${formationId} n'existe pas`);
  }

  await prisma.tagsOnFormation.deleteMany({
    where: { formationId },
  });

  const updatedParcours = await prisma.formation.update({
    where: { id: formationId },
    data: {
      tags: {
        create: newTags.map((tag: any) => {
          return {
            tag: {
              connect: { id: parseInt(tag) },
            },
          };
        }),
      },
    },
    include: { tags: true },
  });

  return updatedParcours;
}

export default putFormationTags;
