import { prisma } from "../../utils/db.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getRootAdminParcours(scope: AccessScope = null) {
  const query = scope
    ? prisma.orm.public.Formation.where((row) =>
        row.parcours.some((parcours) => parcours.id.in(scope.parcoursIds)),
      )
    : prisma.orm.public.Formation;
  const formations = await query
    .select("id", "title", "level")
    .include("parcours", (parcours) =>
      (scope ? parcours.where((row) => row.id.in(scope.parcoursIds)) : parcours)
        .select(
          "id",
          "title",
          "startDate",
          "endDate",
          "isPublished",
          "visibility",
          "thumb",
        )
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
