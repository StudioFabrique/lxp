import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getAllModules(scope: AccessScope = null) {
  const modules = await prisma.module.findMany({
    where:
      scope === null ? undefined : { parcoursId: { in: scope.parcoursIds } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      thumb: true,
      author: true,
      createdAt: true,
      updatedAt: true,
      parcoursId: true,
      parcours: {
        select: {
          title: true,
          formation: { select: { id: true, title: true } },
        },
      },
      courses: { select: { id: true } },
    },
  });

  return modules.map(({ parcours, courses, ...module }) => ({
    ...module,
    parcours: parcours.title,
    formationId: parcours.formation.id,
    formation: parcours.formation.title,
    coursesCount: courses.length,
    hasAccess:
      scope?.kind !== "teacher" || scope.moduleIds?.includes(module.id),
    thumb: module.thumb
      ? Buffer.from(module.thumb as any).toString("base64")
      : null,
  }));
}
