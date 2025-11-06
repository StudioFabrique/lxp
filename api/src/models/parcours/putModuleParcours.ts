import { BonusSkill, Contact, ModuleMetadata, Parcours } from "@prisma/client";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";
import { Metadata } from "sharp";

async function putModuleParcours(
  module: any,
  thumb: any,
  image: any,
  userId: string
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

  let parcoursModule: ModuleMetadata | null = null;
  let updatedParcours: Parcours | null = null;

  const author = `${existingUser?.firstname} ${existingUser?.lastname}`;

  const transaction = await prisma.$transaction(async (tx) => {
    const addModule = await tx.module.create({
      data: {
        title: newModule.title,
        description: newModule.description,
        image,
        thumb,
        author,
        adminId: existingAdmin.id,
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
    });

    parcoursModule = await tx.moduleMetadata.create({
      data: {
        duration: +newModule.duration,
        minDate: new Date(newModule.minDate),
        maxDate: new Date(newModule.maxDate),
        adminId: existingAdmin.id,
        moduleId: addModule.id,
        parcoursId: +newModule.parcoursId,
        contacts: {
          create: newModule.contacts.map((item: Contact) => {
            return {
              contact: {
                connect: { idMdb: item.idMdb },
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
    });

    updatedParcours = await tx.parcours.update({
      where: {
        id: +newModule.parcoursId,
      },
      data: {
        modules: {
          connect: {
            id: parcoursModule.id,
          },
        },
      },
    });

    return updatedParcours;
  });

  if (!transaction || !parcoursModule) {
    const error = {
      message: "Erreur lors de la création du module",
      statusCode: 500,
    };
    throw error;
  }

  return { updatedParcours: transaction, newModule: parcoursModule };
}

export default putModuleParcours;
