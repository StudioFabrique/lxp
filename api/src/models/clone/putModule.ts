import { Module } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putModule(module: Module, image: any, thumb: string) {
  const existingModule = await prisma.module.findFirst({
    where: { id: module.id },
  });

  if (!existingModule) {
    const error = { message: "Le Module n'existe pas;", statusCode: 404 };
    throw error;
  }

  const updatedModule = await prisma.module.update({
    where: { id: module.id },
    data: { ...module, image, thumb },
  });
  return updatedModule;
}

export default putModule;
