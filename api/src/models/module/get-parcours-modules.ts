import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getParcoursModules(
  parcoursId: number,
  scope: AccessScope = null,
) {
  const modules = await prisma.orm.public.Module.where((row) =>
    and(
      row.parcoursId.eq(+parcoursId),
      ...(scope
        ? [
            scope.moduleIds === null
              ? row.parcoursId.in(scope.parcoursIds)
              : row.id.in(scope.moduleIds),
          ]
        : []),
    ),
  )
    .select("id", "title")
    .orderBy((row) => row.createdAt.asc())
    .all();

  return modules;
}
