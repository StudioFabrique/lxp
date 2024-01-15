import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function updateParcoursInfos(
  parcoursId: number,
  title: string,
  description: string,
  formation: number,
  visibility: boolean,
  userId: string
) {
  const existingParcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
  });

  const existingFormation = await prisma.formation.findFirst({
    where: { id: formation },
  });

  if (!existingFormation) {
    const error: any = {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  if (!existingParcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const updatedParcours = await prisma.parcours.update({
    where: { id: parcoursId },
    data: {
      title: title,
      description: description,
      visibility,
      formation: {
        connect: { id: formation },
      },
    },
  });

  return updatedParcours;
}

export default updateParcoursInfos;
