import { prisma } from "../../utils/db";

export default async function deleteModule(
  module: {
    title: string;
    description: string;
    duration: number;
    contacts: any[];
    bonusSkills: any[];
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

    const deletedModule = await prisma.module.delete({
      where: { id: moduleId },
    });

    if (deletedModule) {
      console.log(
        "Module associé au parcours suprrimé avec succès:",
        deletedModule
      );
      return deletedModule.id;
    }
    return null;
  } catch (error) {
    console.error("Erreur de suppression :", error);
    return null;
  }
}
