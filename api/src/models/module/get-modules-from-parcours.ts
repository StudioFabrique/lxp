import { prisma } from "../../utils/db";

async function getModulesFromParcours(parcoursId: number) {
  const parcours = await prisma.parcours.findUnique({
    where: { id: +parcoursId },
    select: {
      modules: {
        select: {
          id: true,
          title: true,
          thumb: true,
          description: true,
          quizInstructions: true,
          duration: true,
          contacts: {
            select: {
              contact: { select: { id: true, name: true, role: true } },
            },
          },
          bonusSkills: {
            select: {
              bonusSkill: { select: { id: true, description: true } },
            },
          },
        },
      },
      formation: { select: { id: true } },
      contacts: {
        select: {
          contact: { select: { id: true, name: true, role: true } },
        },
      },
      bonusSkills: true,
    },
  });

  if (!parcours) throw { statusCode: 404, message: "Parcours introuvable." };

  return {
    modules: parcours.modules.map(({ contacts, bonusSkills, ...module }) => ({
      ...module,
      thumb: module.thumb
        ? Buffer.from(module.thumb as any).toString("base64")
        : null,
      contacts: contacts.map(({ contact }) => contact),
      skills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
    })),
    parcoursData: {
      formationId: parcours.formation.id,
      contacts: parcours.contacts.map(({ contact }) => contact),
      bonusSkills: parcours.bonusSkills,
    },
  };
}

export default getModulesFromParcours;
