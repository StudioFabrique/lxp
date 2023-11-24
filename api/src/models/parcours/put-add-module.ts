import { Module } from "@prisma/client";
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

  const author = `${existingUser?.firstname} ${existingUser?.lastname}`;

  let newModule: any = {};

  const transaction = await prisma.$transaction(async (tx) => {
    newModule = await tx.module.create({
      data: {
        title: existingModule.title,
        description: existingModule.description,
        image: existingModule.image,
        thumb: existingModule.thumb,
        duration: existingModule.duration,
        minDate: new Date(existingParcours.startDate!),
        maxDate: new Date(existingParcours.endDate!),
        author,
        adminId: existingAdmin.id,
      },
    });
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

    console.log({ newModule });
  });

  return newModule;
}

export default putAddModule;
