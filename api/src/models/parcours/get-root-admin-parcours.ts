import { prisma } from "../../utils/db.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getRootAdminParcours(scope: AccessScope = null) {
  const formations = await prisma.formation.findMany({
    where:
      scope === null
        ? undefined
        : { parcours: { some: { id: { in: scope.parcoursIds } } } },
    select: {
      id: true,
      title: true,
      level: true,
      parcours: {
        where:
          scope === null ? undefined : { id: { in: scope.parcoursIds } },
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          isPublished: true,
          thumb: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return formations.map((formation) => ({
    ...formation,
    canManage:
      scope?.kind !== "teacher" ||
      formation.parcours.some((parcours) =>
        scope.directParcoursIds?.includes(parcours.id),
      ),
    parcours: formation.parcours.map((parcours) => ({
      ...parcours,
      thumb: imageToDataUrl(parcours.thumb),
      canManage:
        scope?.kind !== "teacher" ||
        scope.directParcoursIds?.includes(parcours.id),
    })),
  }));
}
