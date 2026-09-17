import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  parcoursWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export function getCalendarParcours(scope: AccessScope) {
  return prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, parcoursWhereForScope(scope)),
  )
    .select("id", "title")
    .orderBy([(row) => row.title.asc(), (row) => row.id.asc()])
    .all();
}

export function getParcoursCalendar(parcoursId: number, scope: AccessScope) {
  const published =
    scope?.kind === "learner" ? { isPublished: true, visibility: true } : {};
  return prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, {
      AND: [{ id: parcoursId }, parcoursWhereForScope(scope) ?? {}],
    }),
  )
    .select("id", "title")
    .include("modules", (related57) =>
      related57
        .where((row) => whereFromObject(row, moduleWhereForScope(scope)))
        .select("id", "title", "description", "minDate", "maxDate")
        .include("courses", (related58) =>
          related58
            .where((row) => whereFromObject(row, published))
            .select("id", "title", "description", "dates")
            .include("assignment", (related59) =>
              related59.select("id", "dueAt"),
            )
            .include("lessons", (related60) =>
              related60
                .where((row) => whereFromObject(row, published))
                .select("id")
                .orderBy([(row) => row.order.asc(), (row) => row.id.asc()])
                .limit(1),
            )
            .orderBy([(row) => row.order.asc(), (row) => row.id.asc()]),
        )
        .orderBy([(row) => row.minDate.asc(), (row) => row.id.asc()]),
    )
    .first();
}
