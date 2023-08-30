import { prisma } from "../../utils/db";

export default async function updateModule(
  module: {
    title: string;
    description: string;
    duration: number;
    contacts: any[];
    bonusSkills: any[];
  },
  moduleId: number
) {
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

    const createdModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        ...module,
        contacts: { createMany: { data: existingContactsId } },
        bonusSkills: { createMany: { data: existingBonusSkillsId } },
      },
    });

    if (createdModule) {
      console.log("Module associé au parcours avec succès:", createdModule);
      return createdModule.id;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de l'association du module au parcours:", error);
    return null;
  }
}
