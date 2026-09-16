import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getAllFormations(scope: AccessScope = null) {
  const formations = await prisma.orm.public.Formation.where((row) =>
    whereFromObject(
      row,
      scope === null
        ? undefined
        : { parcours: { some: { id: { in: scope.parcoursIds } } } },
    ),
  )
    .select("id", "title", "description", "code", "level", "createdAt")
    .include("parcours", (related64) =>
      related64
        .where((row) =>
          whereFromObject(
            row,
            scope === null ? undefined : { id: { in: scope.parcoursIds } },
          ),
        )
        .select("id"),
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
