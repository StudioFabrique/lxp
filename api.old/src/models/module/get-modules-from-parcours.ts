import { prisma } from "../../utils/db";

async function getModulesFromParcours(parcoursId: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    const modulesIds = await tx.modulesOnParcours.findMany({
      where: { parcoursId },
    });
    if (modulesIds.length === 0) {
      const error = new Error("Aucun module associé au parcours");
      (error as any).statusCode = 404;
      throw error;
    }
    const modules = await tx.module.findMany({
      where: {
        id: {
          in: modulesIds.map((module) => module.moduleId),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
    return modules;
  });

  //console.log({ transaction });

  return transaction;
}

export default getModulesFromParcours;
