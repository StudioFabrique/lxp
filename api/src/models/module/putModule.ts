import { BonusSkill, Contact } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putModule(module: any, image?: Buffer, thumb?: Buffer) {
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
        module: {
          update: {
            data: {
              title: module.title,
              description: module.description ?? "",
              quizInstructions: module.quizInstructions ?? "",
              ...(image
                ? {
                    image: Uint8Array.from(image) as Uint8Array<ArrayBuffer>,
                    thumb: thumb
                      ? (Uint8Array.from(thumb) as Uint8Array<ArrayBuffer>)
                      : undefined,
                  }
                : {}),
            },
          },
        },
      },
      select: {
        id: true,
        duration: true,
        minDate: true,
        maxDate: true,
        module: {
          select: {
            title: true,
            description: true,
            quizInstructions: true,
            thumb: true,
          },
        },
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
    minDate: updatedModule.minDate,
    maxDate: updatedModule.maxDate,
    title: updatedModule.module?.title,
    description: updatedModule.module?.description,
    quizInstructions: updatedModule.module?.quizInstructions,
    thumb: updatedModule.module?.thumb
      ? Buffer.from(updatedModule.module.thumb).toString("base64")
      : null,
    contacts: updatedModule.contacts.map(
      (c: { contact: { id: number; name: string; role: string } }) => c.contact,
    ),
    bonusSkills: updatedModule.bonusSkills.map(
      (bs: { bonusSkill: { id: number; description: string } }) =>
        bs.bonusSkill,
    ),
  };

  return result;
}

export default putModule;
