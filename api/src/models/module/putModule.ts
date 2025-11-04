import { BonusSkill, Contact } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putModule(module: any) {
  console.log({ module });

  const existingModule = await prisma.moduleMetadata.findFirst({
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
        duration: true,
        contacts: {
          select: {
            contact: {
              select: { id: true, name: true, role: true },
            },
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
    id: updatedModule.id,
    duration: updatedModule.duration ? updatedModule.duration : 1,
    contacts: updatedModule.contacts.map(
      (c: { contact: { id: number; name: string; role: string } }) => c.contact
    ),
    skills: updatedModule.bonusSkills.map(
      (bs: { bonusSkill: { id: number; description: string } }) => bs.bonusSkill
    ),
  };

  return result;
}

export default putModule;
