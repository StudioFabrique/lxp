import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function putParcoursTags(parcoursId: number, newTags: Array<number>) {
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
  });
  return updatedParcours;
}

export default putParcoursTags;
