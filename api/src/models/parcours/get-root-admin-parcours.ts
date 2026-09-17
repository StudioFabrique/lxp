import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getRootAdminParcours(scope: AccessScope = null) {
  const formations = await prisma.orm.public.Formation.where((row) =>
    whereFromObject(
      row,
      scope === null
        ? undefined
        : { parcours: { some: { id: { in: scope.parcoursIds } } } },
    ),
  )
    .select("id", "title", "level")
    .include("parcours", (related242) =>
      related242
        .where((row) =>
          whereFromObject(
            row,
            scope === null ? undefined : { id: { in: scope.parcoursIds } },
          ),
        )
        .select("id", "title", "startDate", "endDate", "isPublished", "thumb")
        .orderBy((row) => row.createdAt.desc()),
    )
    .orderBy((row) => row.createdAt.desc())
    .all();

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
