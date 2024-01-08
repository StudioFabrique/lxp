import { BonusSkill, Contact } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putModule(module: any, thumb: any, image: any) {
  const existingModule = await prisma.module.findFirst({
    where: { id: module.id },
  });

  if (!existingModule) {
    const error = { message: "Le Module n'existe pas;", statusCode: 404 };
    throw error;
  }

  let updatedModule: any;

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.contactsOnModule.deleteMany({
      where: { moduleId: module.id },
    });

    await tx.bonusSkillsOnModule.deleteMany({
      where: { moduleId: module.id },
    });

    updatedModule = await tx.module.update({
      where: { id: module.id },
      data: {
        title: module.title,
        description: module.description,
        image: image !== undefined ? image : existingModule.image,
        thumb: thumb !== undefined ? thumb : existingModule.thumb,
        duration: +module.duration,
        contacts: {
          create: module.contacts.map((id: number) => {
            return {
              contact: {
                connect: { id },
              },
            };
          }),
        },
        bonusSkills: {
          create: module.bonusSkills.map((id: number) => {
            return {
              bonusSkill: {
                connect: { id },
              },
            };
          }),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        thumb: true,
        minDate: true,
        maxDate: true,
        contacts: {
          select: {
            contact: true,
          },
        },
        bonusSkills: {
          select: {
            bonusSkill: {
              select: {
                id: true,
                description: true,
              },
            },
          },
        },
      },
    });
  });

  const result = {
    ...updatedModule,
    thumb: updatedModule.thumb.toString("base64"),
  };

  return result;
}

export default putModule;
