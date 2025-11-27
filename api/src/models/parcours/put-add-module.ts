import { Module } from "../../../generated/prisma/client";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

async function putAddModule(
  moduleId: number,
  parcoursId: number,
  userId: string
) {
  const existingParcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
  });
  const existingModule = await prisma.module.findFirst({
    where: { id: moduleId },
  });

  if (!existingModule || !existingParcours) {
    const error = { message: "Ressource inexistante", statusCode: 404 };
    throw error;
  }

  const existingUser = await User.findById(userId, {
    firstname: 1,
    lastname: 1,
  });

  if (!existingUser) {
    const error = { message: "Ressource inexistante", statusCode: 404 };
    throw error;
  }

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin) {
    const error = { message: "Ressource inexistante", statusCode: 404 };
    throw error;
  }

  let newModule: any = {};

  const transaction = await prisma.$transaction(async (tx) => {
    newModule = await tx.moduleMetadata.create({
      data: {
        duration: 0,
        minDate: new Date(existingParcours.startDate!),
        maxDate: new Date(existingParcours.endDate!),
        adminId: existingAdmin.id,
        moduleId: existingModule.id,
        parcoursId: existingParcours.id,
      },
      include: { module: { select: { title: true, thumb: true } } },
    });
    /*
    const updatedParcours = await tx.parcours.update({
      where: { id: parcoursId },
      data: {
        modules: {
          create: {
            module: {
              connect: { id: newModule.id },
            },
          },
        },
      },
    });
*/
  });

  return { ...newModule, title: (newModule.module as Module).title };
}

export default putAddModule;
