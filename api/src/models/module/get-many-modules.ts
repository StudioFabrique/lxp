export default async function getManyModules(parcoursId: number) {
  const modules = await prisma?.module.findMany({
    where: { parcours: { some: { parcoursId: parcoursId } } },
    include: {
      bonusSkills: {
        select: { bonusSkill: { select: { id: true, description: true } } },
      },
      contacts: {
        select: { contact: { select: { idMdb: true, name: true } } },
      },
    },
  });

  if (!modules) {
    return null;
  }

  const updatedModules = modules.map((module) => {
    const bonusSkills = module.bonusSkills.map(
      (bonusSkill) => bonusSkill.bonusSkill
    );

    const contacts = module.contacts.map((contact) => contact.contact);

    const updatedModule: any = module;
    updatedModule.bonusSkills = bonusSkills;
    updatedModule.contacts = contacts;
    return updatedModule;
  });

  return updatedModules;
}
