import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getParcoursModules(
  parcoursId: number,
  scope: AccessScope = null,
) {
  const modules = await prisma.module.findMany({
    where: {
      parcoursId: +parcoursId,
      ...(moduleWhereForScope(scope) ?? {}),
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true },
  });

  return modules;
}
