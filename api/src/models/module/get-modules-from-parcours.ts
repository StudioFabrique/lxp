import { prisma } from "../../utils/db";

async function getModulesFromParcours(parcoursId: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    const modulesIds = await tx.modulesOnParcours.findMany({
      where: { parcoursId },
    });
    if (modulesIds.length === 0) {
      const error = new Error("Aucun module associé au parcours");
      (error as any).statusCode = 404; // Added type assertion to assign statusCode
      throw error;
    }
    const modules = await tx.module.findMany({
      where: {
        id: {
          in: modulesIds.map((module) => module.moduleId), // Fixed mapping function
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
    return modules; // Added return statement
  });

  console.log({ transaction });

  return transaction; // Added return statement
}

export default getModulesFromParcours;
