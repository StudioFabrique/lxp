import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getParcoursModules(
  parcoursId: number,
  scope: AccessScope = null,
) {
  const modules = await prisma.orm.public.Module.where((row) =>
    whereFromObject(row, {
      parcoursId: +parcoursId,
      ...(moduleWhereForScope(scope) ?? {}),
    }),
  )
    .select("id", "title")
    .orderBy((row) => row.createdAt.asc())
    .all();

  return modules;
}
