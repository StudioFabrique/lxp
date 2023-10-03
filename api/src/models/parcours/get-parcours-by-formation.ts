import { prisma } from "../../utils/db";

async function getParcoursByFormation(formationId: number) {
  const parcours = await prisma.parcours.findMany({
    where: {
      formationId,
    },
  });
  return parcours;
}

export default getParcoursByFormation;
