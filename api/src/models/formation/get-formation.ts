import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function getFormation(scope: AccessScope = null) {
  const query = scope
    ? prisma.orm.public.Formation.where((row) =>
        row.parcours.some((parcours) => parcours.id.in(scope.parcoursIds)),
      )
    : prisma.orm.public.Formation;
  const formations = await query.select("id", "title").all();

  if (!formations || formations.length === 0) {
    return false;
  }

  return formations;
}

export default getFormation;
