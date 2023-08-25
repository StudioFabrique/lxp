import { prisma } from "../../utils/db";

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
