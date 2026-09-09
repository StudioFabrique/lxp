import { prisma } from "../../utils/db.ts";
import { moduleWhereForScope, parcoursWhereForScope, type AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export function getCalendarParcours(scope: AccessScope) {
  return prisma.parcours.findMany({
    where: parcoursWhereForScope(scope),
    select: { id: true, title: true },
    orderBy: [{ title: "asc" }, { id: "asc" }],
  });
}

export function getParcoursCalendar(parcoursId: number, scope: AccessScope) {
  const published = scope?.kind === "learner" ? { isPublished: true, visibility: true } : {};
  return prisma.parcours.findFirst({
    where: { AND: [{ id: parcoursId }, parcoursWhereForScope(scope) ?? {}] },
    select: {
      id: true, title: true,
      modules: {
        where: moduleWhereForScope(scope),
        orderBy: [{ minDate: "asc" }, { id: "asc" }],
        select: {
          id: true, title: true, description: true, minDate: true, maxDate: true,
          courses: {
            where: published,
            orderBy: [{ order: "asc" }, { id: "asc" }],
            select: {
              id: true, title: true, description: true, dates: true,
              lessons: { where: published, orderBy: [{ order: "asc" }, { id: "asc" }], take: 1, select: { id: true } },
            },
          },
        },
      },
    },
  });
}
