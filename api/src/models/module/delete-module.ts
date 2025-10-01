import { prisma } from "../../utils/db";

async function deleteModule(moduleId: number) {
  const existingModule = await prisma.moduleMetadata.findFirst({
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
    await tx.contactsOnModuleMetadata.deleteMany({
      where: { moduleId },
    });
    await tx.bonusSkillsOnModuleMetadata.deleteMany({
      where: { moduleId },
    });
    deletedModule = await tx.moduleMetadata.delete({
      where: { id: moduleId },
    });
  });
  return deletedModule;
}

export default deleteModule;
