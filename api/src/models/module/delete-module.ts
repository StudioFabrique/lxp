import { prisma } from "../../utils/db";

export default async function deleteModule(moduleId: number) {
  console.log("module : ");
  console.log(module);

  console.log("moduleId : " + moduleId);

  try {
    await prisma.bonusSkillsOnModule.deleteMany({
      where: {
        moduleId: moduleId,
      },
    });

    await prisma.contactsOnModule.deleteMany({
      where: {
        moduleId: moduleId,
      },
    });

    await prisma.modulesOnParcours.deleteMany({
      where: {
        moduleId: moduleId,
      },
    });

    const deletedModule = await prisma.module.delete({
      where: { id: moduleId },
    });

    if (deletedModule) {
      console.log(
        "Module associé au parcours suprrimé avec succès:",
        deletedModule
      );
      return deletedModule.id;
    }
    return null;
  } catch (error) {
    console.error("Erreur de suppression :", error);
    return null;
  }
}
