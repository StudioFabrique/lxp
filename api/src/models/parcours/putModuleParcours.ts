import { BonusSkill, Contact, Module, Parcours } from "@prisma/client";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

async function putModuleParcours(
  module: any,
  thumb: any,
  image: any,
  userId: string,
) {
  const newModule = JSON.parse(module);

  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +newModule.parcoursId },
  });

  if (!existingParcours) {
    const newError = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw newError;
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
        author,
        adminId: existingAdmin.id,
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

  return updatedParcours ? parcoursModule : false;
}

export default putModuleParcours;
