import { prisma } from "../../utils/db";

async function getModulesFromParcours(parcoursId: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    const modulesIds = await tx.modulesOnParcours.findMany({
      where: { parcoursId },
    });

    const modules = await tx.module.findMany({
      where: {
        id: {
          in: modulesIds.map((module) => module.moduleId),
        },
      },
      select: {
        id: true,
        title: true,
      },
    });
    return modules;
  });

  //console.log({ transaction });

  return transaction;
}

export default getModulesFromParcours;
