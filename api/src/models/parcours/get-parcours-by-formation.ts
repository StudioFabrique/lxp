import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcoursByFormation(formationId: number) {
  const parcours = await prisma.parcours.findMany({
    where: {
      formationId,
    },
  });

  console.log({ parcours });

  return parcours;
}

export default getParcoursByFormation;
