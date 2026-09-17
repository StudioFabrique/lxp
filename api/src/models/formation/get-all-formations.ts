import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getAllFormations(scope: AccessScope = null) {
  const query = scope
    ? prisma.orm.public.Formation.where((row) =>
        row.parcours.some((parcours) => parcours.id.in(scope.parcoursIds)),
      )
    : prisma.orm.public.Formation;
  const formations = await query
    .select("id", "title", "description", "code", "level", "createdAt")
    .include("parcours", (parcours) =>
      (scope
        ? parcours.where((row) => row.id.in(scope.parcoursIds))
        : parcours
      ).select("id"),
    )
    .include("tags", (related65) =>
      related65.include("tag", (related66) => related66.select("id")),
    )
    .orderBy((row) => row.id.desc())
    .all();

  const result = formations.map((item) => ({
    ...item,
    parcours: item.parcours.length,
    tags: item.tags.map((item) => item.tag!.id),
  }));

  return result;
}
