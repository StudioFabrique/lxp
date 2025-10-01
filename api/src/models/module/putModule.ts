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
    await tx.contactsOnModuleMetadata.deleteMany({
      where: { moduleId: module.id },
    });

    await tx.bonusSkillsOnModuleMetadata.deleteMany({
      where: { moduleId: module.id },
    });

    updatedModule = await tx.moduleMetadata.update({
      where: { id: module.id },
      data: {
        duration: +module.duration,
        contacts: {
          create: module.contactsIds.map((id: number) => {
            return {
              contact: {
                connect: { id },
              },
            };
          }),
        },
        bonusSkills: {
          create: module.bonusSkillsIds.map((id: number) => {
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
    thumb: updatedModule.thumb?.toString("base64") ?? null,
  };

  return result;
}

export default putModule;
