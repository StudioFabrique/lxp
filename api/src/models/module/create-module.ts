import { prisma } from "../../utils/db";

export default async function createModule(
  module: { title: string; description: string; duration: number },
  parcoursId: number
) {
  try {
    const createdModule = await prisma.module.create({
      data: { ...module, parcours: { connect: { id: parcoursId } } },
    });

    /* const contacts: any[] = module.contacts;
    const skills: any[] = module.skills;

    const contactsLink: { contactId: number; moduleId: number }[] =
      contacts.map((contact) => {
        return { contactId: contact.id, moduleId: createdModule.id };
      });

    const skillsLink: { skillId: number; moduleId: number }[] = skills.map(
      (skill) => {
        return { skillId: skill.id, moduleId: createdModule.id };
      }
    ); */

    if (createdModule) {
      console.log("Module associé au parcours avec succès:", createdModule);
      return createdModule;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de l'association du module au parcours:", error);
    return null;
  }
}
