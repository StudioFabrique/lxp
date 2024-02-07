import { prisma } from "../../utils/db";

export default async function getAllFormations() {
  const formations = await prisma.formation.findMany({
    select: {
      id: true,
      title: true,
      code: true,
      level: true,
      parcours: {
        select: {
          id: true,
        },
      },
    },
  });

  const result = formations.map((item) => ({
    ...item,
    parcours: item.parcours.length,
  }));

  return result;
}
