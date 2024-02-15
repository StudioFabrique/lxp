import { prisma } from "../../utils/db";

export default async function getAllFormations() {
  const formations = await prisma.formation.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      level: true,
      createdAt: true,
      parcours: {
        select: {
          id: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  const result = formations.map((item) => ({
    ...item,
    parcours: item.parcours.length,
    tags: item.tags.map((item) => item.tag.id),
  }));

  return result;
}
