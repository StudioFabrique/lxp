import { prisma } from "../../utils/db";

async function deleteModule(moduleId: number) {
  const existingModule = await prisma.module.findFirst({
    where: { id: moduleId },
    select: { courses: true },
  });

  if (!existingModule) {
    const error = { message: "Le module n'existe pas", statusCode: 404 };
    throw error;
  }

  if (existingModule.courses && existingModule.courses.length > 0) {
    const error = {
      message: "Suppression impossible, des cours sont rattachés à ce module",
      statusCode: 405,
    };
    throw error;
  }

  let deletedModule = {};

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.contactsOnModule.deleteMany({
      where: { moduleId },
    });
    await tx.bonusSkillsOnModule.deleteMany({
      where: { moduleId },
    });
    await tx.modulesOnParcours.deleteMany({
      where: { moduleId },
    });

    deletedModule = await tx.module.delete({
      where: { id: moduleId },
    });
  });
  return deletedModule;
}

export default deleteModule;
