import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function getParcoursByFormation(
  formationId: number,
  scope: AccessScope = null,
) {
  const parcours = await prisma.parcours.findMany({
    where: {
      formationId,
      ...(scope !== null && { id: { in: scope.parcoursIds } }),
    },
  });
  return parcours.map((item) => ({
    ...item,
    canManage:
      scope?.kind !== "teacher" ||
      scope.directParcoursIds?.includes(item.id),
  }));
}

export default getParcoursByFormation;
