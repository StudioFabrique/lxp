import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcoursById(parcoursId: number) {
  console.log({ parcoursId });

  const parcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
    include: { formation: true },
  });
  if (parcours) {
    return parcours;
  }
  throw new Error("Aucun parcours trouvé");
}

export default getParcoursById;
