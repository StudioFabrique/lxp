import { prisma } from "../../utils/db";

export default async function updateModule(
  module: {
    title: string;
    description: string;
    duration: number;
    contacts: any[];
    bonusSkills: any[];
    imageFile: any;
  },
  moduleId: number
) {
  console.log("module : ");
  console.log(module);

  console.log("moduleId : " + moduleId);

  try {
    const existingContactsId = (
      await prisma.contact.findMany({
        where: {
          idMdb: {
            in: module.contacts.map((item: any) => item.idMdb),
          },
        },
      })
    ).map((prismaContacts) => {
      return {
        contactId: prismaContacts.id,
      };
    });

    const existingBonusSkillsId = module.bonusSkills.map(
      (prismaBonusSkills) => {
        return {
          bonusSkillId: prismaBonusSkills.id,
        };
      }
    );

    console.log(existingContactsId);
    console.log(existingBonusSkillsId);

    await prisma.bonusSkillsOnModule.deleteMany({
      where: {
        bonusSkillId: {
          in: existingBonusSkillsId.map((id) => id.bonusSkillId),
        },
        moduleId: moduleId,
      },
    });

    await prisma.contactsOnModule.deleteMany({
      where: {
        contactId: {
          in: existingContactsId.map((id) => id.contactId),
        },
        moduleId: moduleId,
      },
    });

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        ...module,
        contacts: { createMany: { data: existingContactsId } },
        bonusSkills: { createMany: { data: existingBonusSkillsId } },
      },
    });

    if (updatedModule) {
      console.log("Module associé au parcours avec succès:", updatedModule);
      return updatedModule.id;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de l'association du module au parcours:", error);
    return null;
  }
}
