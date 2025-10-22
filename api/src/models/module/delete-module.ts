import { ModuleMetadata } from "@prisma/client";
import { prisma } from "../../utils/db";
import { IRole } from "../../utils/interfaces/db/role";

async function deleteModule(moduleId: number, userId: string, role: IRole) {
  const existingModule = await prisma.moduleMetadata.findFirst({
    where: { id: moduleId },
    select: {
      courses: true,
      module: { select: { id: true, metadatas: true } },
      admin: true,
    },
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

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (
    !existingAdmin ||
    (role.role !== "admin" && existingModule.admin.id !== existingAdmin.id)
  ) {
    throw { message: "Unauthorized", statusCode: 403 };
  }

  let deletedModule: ModuleMetadata | null = null;

  const transaction = await prisma.$transaction(async (tx) => {
    deletedModule = await tx.moduleMetadata.delete({
      where: { id: moduleId },
    });
  });

  console.log(existingModule.module.metadatas.length);

  if (existingModule.module.metadatas.length < 2) {
    await prisma.module.delete({
      where: { id: existingModule.module.id },
    });
  }
  return transaction;
}

export default deleteModule;
