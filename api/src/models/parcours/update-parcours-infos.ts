import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateParcoursInfos(
  parcoursId: number,
  title: string,
  description: string,
  formation: number
) {
  try {
    const updatedParcours = await prisma.parcours.update({
      where: { id: parcoursId },
      data: {
        title: title,
        description: description,
        formation: {
          connect: { id: formation },
        },
      },
    });
    return updatedParcours;
  } catch (error) {
    throw new Error("Le parcours n'existe pas");
  }
}

export default updateParcoursInfos;
