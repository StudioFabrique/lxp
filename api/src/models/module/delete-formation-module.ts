import { prisma } from "../../utils/db";

export default async function deleteFormationModule(moduleId: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    await tx.modulesOnFormation.deleteMany({
      where: { moduleId },
    });
    await tx.module.delete({
      where: { id: moduleId },
    });
  });
}
