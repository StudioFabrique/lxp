import { prisma } from "../../utils/db.ts";

async function getParcoursByFormation(formationId: number) {
  const parcours = await prisma.parcours.findMany({
    where: {
      formationId,
    },
  });
  return parcours;
}

export default getParcoursByFormation;
