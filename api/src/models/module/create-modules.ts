import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function createModulesOnParcours(
  modules: {
    title: string;
    description: string;
    image: Buffer;
    duration: number;
    rating: number;
  }[],
  parcoursId: number
) {
  try {
    const createdModulesOnParcours = await prisma.modulesOnParcours.createMany({
      data: modules.map((module) => ({
        moduleId: 0,
        parcoursId: parcoursId,
        module: module,
      })),
    });

    console.log(
      "Modules associés au parcours avec succès:",
      createdModulesOnParcours
    );
  } catch (error) {
    console.error(
      "Erreur lors de l'association des modules au parcours:",
      error
    );
  }
}
