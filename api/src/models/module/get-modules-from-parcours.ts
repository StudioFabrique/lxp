import { prisma } from "../../utils/db";

async function getModulesFromParcours(parcoursId: number) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +parcoursId },
    select: {
      modules: {
        select: {
          id: true,
          module: { select: { title: true, thumb: true } },
        },
      },
      formation: { select: { id: true } },
      contacts: {
        select: {
          contact: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
      bonusSkills: true,
    },
  });

  if (!existingParcours)
    throw { statusCode: 404, message: "Parcours introuvable." };

  const modules =
    existingParcours?.modules.map((mod) => ({
      id: mod.id,
      title: mod.module.title,
      thumb: mod.module.thumb?.toString("base64") ?? null,
    })) ?? [];

  const parcoursData = {
    formationId: existingParcours.formation.id,
    contacts: existingParcours.contacts.map((c) => c.contact),
    bonusdSkills: existingParcours.bonusSkills,
  };

  return { modules, parcoursData };
}

export default getModulesFromParcours;
