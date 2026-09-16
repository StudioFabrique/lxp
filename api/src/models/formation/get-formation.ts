import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function getFormation(scope: AccessScope = null) {
  const formations = await prisma.orm.public.Formation.where((row) =>
    whereFromObject(
      row,
      scope === null
        ? undefined
        : { parcours: { some: { id: { in: scope.parcoursIds } } } },
    ),
  )
    .select("id", "title")
    .all();

  if (!formations || formations.length === 0) {
    return false;
  }

  return formations;
}

export default getFormation;
