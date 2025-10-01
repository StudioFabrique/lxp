import { prisma } from "../../utils/db";

async function getModulesFromParcours(parcoursId: number) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +parcoursId },
    select: {
      modules: true,
    },
  });

  return existingParcours?.modules ?? [];
}

export default getModulesFromParcours;
