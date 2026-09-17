import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function getParcoursByFormation(
  formationId: number,
  scope: AccessScope = null,
) {
  const parcours = await prisma.orm.public.Parcours.where((row) =>
    and(
      row.formationId.eq(formationId),
      ...(scope ? [row.id.in(scope.parcoursIds)] : []),
    ),
  ).all();
  return parcours.map((item) => ({
    ...item,
    canManage:
      scope?.kind !== "teacher" || scope.directParcoursIds?.includes(item.id),
  }));
}

export default getParcoursByFormation;
