import { prisma } from "../../utils/db";

export default async function createModule(
  module: {
    title: string;
    description: string;
    image: Buffer;
    duration: number;
    rating: number;
  },
  parcoursId: number
) {
  try {
    const createdModule = await prisma.module.create({
      data: module, // Create the module
    });

    const createdModulesOnParcours = await prisma.modulesOnParcours.create({
      data: {
        module: {
          connect: { id: createdModule.id }, // Connect the module to the association
        },
        parcours: {
          connect: { id: parcoursId }, // Connect the parcours to the association
        },
      },
    });

    console.log("Module associé au parcours avec succès:", createdModule);
    return createdModule;
  } catch (error) {
    console.error("Erreur lors de l'association du module au parcours:", error);
    return null;
  }
}
