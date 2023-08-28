import { prisma } from "../../utils/db";

export default async function createModule(module: any, parcoursId: number) {
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
    if (createdModule && createdModulesOnParcours) {
      console.log("Module associé au parcours avec succès:", createdModule);
      return createdModule;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de l'association du module au parcours:", error);
    return null;
  }
}
