import { prisma } from "../../utils/db";

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
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default updateParcoursInfos;
