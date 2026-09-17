import { or } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import { getPagination } from "../../utils/services/getPagination.ts";

/**
 * Colonnes de tri autorisées.
 *
 * `stype` et `sdir` viennent de l'URL et alimentaient directement la clause
 * `orderBy` : n'importe quel nom de champ pouvait y être injecté, y compris un
 * champ non exposé par la sélection.
 */
export default async function getResourcesList(
  stype: string,
  sdir: string,
  page: number,
  limit: number,
  searchTerm?: string,
) {
  const searchPattern = searchTerm
    ? `%${searchTerm.replace(/[\\%_]/g, "\\$&")}%`
    : null;
  const query = searchPattern
    ? prisma.orm.public.Resource.where((resource) =>
        or(
          resource.title.ilike(searchPattern),
          resource.description.ilike(searchPattern),
          resource.author.ilike(searchPattern),
          resource.tags.some((assignment) =>
            assignment.tag.some((tag) => tag.name.ilike(searchPattern)),
          ),
        ),
      )
    : prisma.orm.public.Resource;

  const resources = await query
    .include("bonusActivities", (related31) =>
      related31
        .select("id", "title", "type", "order")
        .orderBy((row) => row.order.asc()),
    )
    .orderBy((row) => {
      const descending = sdir === "desc";
      if (stype === "id") return descending ? row.id.desc() : row.id.asc();
      if (stype === "description") {
        return descending ? row.description.desc() : row.description.asc();
      }
      if (stype === "author") {
        return descending ? row.author.desc() : row.author.asc();
      }
      if (stype === "createdAt") {
        return descending ? row.createdAt.desc() : row.createdAt.asc();
      }
      if (stype === "updatedAt") {
        return descending ? row.updatedAt.desc() : row.updatedAt.asc();
      }
      return descending ? row.title.desc() : row.title.asc();
    })
    .offset(getPagination(page, limit))
    .limit(limit)
    .all();

  const totaltResources = await query
    .aggregate((aggregate) => ({ total: aggregate.count() }))
    .then(({ total }) => total);

  return {
    resources: resources.map(({ bonusActivities, ...resource }) => ({
      ...resource,
      activities: bonusActivities,
    })),
    totaltResources,
  };
}
