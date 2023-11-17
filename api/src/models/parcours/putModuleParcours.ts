import { BonusSkill, Contact, Module, Parcours } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putModuleParcours(module: any, thumb: any, image: any) {
  const newModule = JSON.parse(module);

  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +newModule.parcoursId },
  });

  if (!existingParcours) {
    const newError = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw newError;
  }

  let parcoursModule: Module | null = null;
  let updatedParcours: Parcours | null = null;

  const transaction = await prisma.$transaction(async (tx) => {
    /*     const addModule = await tx.module.create({
      data: {
        title: newModule.title,
        description: newModule.description,
        duration: +newModule.duration,
        image,
        thumb,
        formations: {
          create: newModule.formations.map((item: any) => {
            return {
              formation: {
                connect: { id: item },
              },
            };
          }),
        },
      },
    }); */

    parcoursModule = await tx.module.create({
      data: {
        title: newModule.title,
        description: newModule.description,
        image,
        thumb,
        duration: +newModule.duration,
        minDate: new Date(newModule.minDate),
        maxDate: new Date(newModule.maxDate),
        contacts: {
          create: newModule.contacts.map((item: Contact) => {
            return {
              contact: {
                connect: { id: item.id },
              },
            };
          }),
        },
        bonusSkills: {
          create: newModule.bonusSkills.map((item: BonusSkill) => {
            return {
              bonusSkill: {
                connect: { id: item.id },
              },
            };
          }),
        },
      },
      include: {
        contacts: { select: { contact: true } },
        bonusSkills: {
          select: {
            bonusSkill: { select: { id: true, description: true } },
          },
        },
      },
    });

    updatedParcours = await tx.parcours.update({
      where: {
        id: +newModule.parcoursId,
      },
      data: {
        modules: {
          create: {
            module: {
              connect: { id: parcoursModule.id },
            },
          },
        },
      },
    });
  });

  console.log({ updatedParcours });

  return updatedParcours ? parcoursModule : false;
}

export default putModuleParcours;
