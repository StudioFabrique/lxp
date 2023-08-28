import { prisma } from "../../utils/db";

export default async function createModule(module: any, parcoursId: number) {
  try {
    const createdModule = await prisma.module.create({
      data: {
        title: module.title,
        description: module.title,
        duration: module.duration,
        // image: module.image,
      },
    });

    const contacts: any[] = module.contacts;
    const skills: any[] = module.skills;

    const contactsLink: { contactId: number; moduleId: number }[] =
      contacts.map((contact) => {
        return { contactId: contact.id, moduleId: createdModule.id };
      });

    const skillsLink: { skillId: number; moduleId: number }[] = skills.map(
      (skill) => {
        return { skillId: skill.id, moduleId: createdModule.id };
      }
    );

    await prisma.contactsOnModule.createMany({
      data: contactsLink,
    });

    await prisma.skillsOnModule.createMany({ data: skillsLink });

    const createdModulesOnParcours = await prisma.modulesOnParcours.create({
      data: {
        module: {
          connect: { id: createdModule.id }, // Connect the module to the association
        },
        parcours: {
          connect: { id: parcoursId }, // Connect the parcours to the association
        },
      },
    });
    if (createdModule && createdModulesOnParcours) {
      console.log("Module associé au parcours avec succès:", createdModule);
      return createdModule;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de l'association du module au parcours:", error);
    return null;
  }
}
