import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getAllFormations(scope: AccessScope = null) {
  const formations = await prisma.formation.findMany({
    where:
      scope === null
        ? undefined
        : { parcours: { some: { id: { in: scope.parcoursIds } } } },
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      level: true,
      createdAt: true,
      parcours: {
        where:
          scope === null ? undefined : { id: { in: scope.parcoursIds } },
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
