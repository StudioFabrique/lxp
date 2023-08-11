import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcoursById(parcoursId: number) {
  const parcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      image: true,
      virtualClass: true,
      formation: {
        select: {
          id: true,
          title: true,
          tags: {
            select: { tag: { select: { id: true, name: true, color: true } } },
          },
          level: true,
        },
      },
      tags: {
        select: { tag: { select: { id: true, name: true, color: true } } },
      },
      contacts: {
        select: {
          contact: {
            select: { id: true, idMdb: true, name: true, role: true },
          },
        },
      },
      skills: { include: { skill: true } },
      bonusSkills: { select: { id: true, description: true, badge: true } },
    },
  });

  if (parcours) {
    if (parcours.image instanceof Buffer) {
      const base64Image = parcours.image.toString("base64");
      const result = { ...parcours, image: base64Image };
      return result;
    }

    return parcours;
  }
  throw new Error("Aucun parcours trouvé");
}

export default getParcoursById;
