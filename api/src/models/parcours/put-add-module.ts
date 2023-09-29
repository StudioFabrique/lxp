import { Module } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putAddModule(moduleId: number, parcoursId: number) {
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
