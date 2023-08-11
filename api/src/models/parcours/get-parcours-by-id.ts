import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcoursById(parcoursId: number) {
  const parcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
    include: {
      formation: { include: { tags: { include: { tag: true } } } },
      tags: { include: { tag: true } },
      contacts: { include: { contact: true } },
      skills: { include: { skill: true } },
      bonusSkills: true,
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
