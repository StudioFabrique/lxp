import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcoursByFormation(formationId: number) {
  console.log({ formationId });

  const parcours = await prisma.parcours.findMany({
    where: {
      formationId: formationId,
    },
  });

  console.log({ parcours });

  if (!parcours || parcours.length === 0) {
    return false;
  }

  return parcours;
}

export default getParcoursByFormation;
