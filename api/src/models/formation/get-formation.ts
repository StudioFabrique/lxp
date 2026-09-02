import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function getFormation(scope: AccessScope = null) {
  const formations = await prisma.formation.findMany({
    where:
      scope === null
        ? undefined
        : { parcours: { some: { id: { in: scope.parcoursIds } } } },
    select: { id: true, title: true },
  });

  if (!formations || formations.length === 0) {
    return false;
  }

  return formations;
}

export default getFormation;
