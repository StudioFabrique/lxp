import { all, and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export function getCalendarParcours(scope: AccessScope) {
  const query = scope
    ? prisma.orm.public.Parcours.where((row) => row.id.in(scope.parcoursIds))
    : prisma.orm.public.Parcours;
  return query
    .select("id", "title")
    .orderBy([(row) => row.title.asc(), (row) => row.id.asc()])
    .all();
}

export function getParcoursCalendar(parcoursId: number, scope: AccessScope) {
  const parcoursQuery = scope
    ? prisma.orm.public.Parcours.where((row) =>
        and(row.id.eq(parcoursId), row.id.in(scope.parcoursIds)),
      )
    : prisma.orm.public.Parcours.where({ id: parcoursId });
  return parcoursQuery
    .select("id", "title")
    .include("modules", (modules) =>
      (scope
        ? modules.where((row) =>
            scope.moduleIds === null
              ? row.parcoursId.in(scope.parcoursIds)
              : row.id.in(scope.moduleIds),
          )
        : modules
      )
        .select("id", "title", "description", "minDate", "maxDate")
        .include("courses", (related58) =>
          related58
            .where((row) =>
              scope?.kind === "learner"
                ? and(row.isPublished.eq(true), row.visibility.eq(true))
                : all(),
            )
            .select("id", "title", "description", "dates")
            .include("assignment", (related59) =>
              related59.select("id", "dueAt"),
            )
            .include("lessons", (related60) =>
              related60
                .where((row) =>
                  scope?.kind === "learner"
                    ? row.visibility.eq(true)
                    : all(),
                )
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
