import { prisma } from "../../utils/db";

export default async function createModule(
  module: {
    title: string;
    description: string;
    duration: number;
    contacts: any[];
    bonusSkills: any[];
  },
  parcoursId: number
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

    const updatedModule = await prisma.module.create({
      data: {
        ...module,
        contacts: { createMany: { data: existingContactsId } },
        bonusSkills: { createMany: { data: existingBonusSkillsId } },
        parcours: { connect: { id: parcoursId } },
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
