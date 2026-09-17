import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import { getPagination } from "../../utils/services/getPagination.ts";

/**
 * Colonnes de tri autorisées.
 *
 * `stype` et `sdir` viennent de l'URL et alimentaient directement la clause
 * `orderBy` : n'importe quel nom de champ pouvait y être injecté, y compris un
 * champ non exposé par la sélection.
 */
const SORTABLE_COLUMNS = [
  "id",
  "title",
  "description",
  "author",
  "createdAt",
  "updatedAt",
] as const;

const DEFAULT_COLUMN = "title";

function sortClause(stype: string, sdir: string) {
  const column = (SORTABLE_COLUMNS as readonly string[]).includes(stype)
    ? stype
    : DEFAULT_COLUMN;
  const direction = sdir === "desc" ? "desc" : "asc";

  return { [column]: direction };
}

export default async function getResourcesList(
  stype: string,
  sdir: string,
  page: number,
  limit: number,
  searchTerm?: string,
) {
  const whereCondition = searchTerm
    ? {
        OR: [
          ...["title", "description", "author"].map((field) => ({
            [field]: { contains: searchTerm, mode: "insensitive" as const },
          })),
          {
            tags: {
              some: {
                tag: {
                  name: { contains: searchTerm, mode: "insensitive" as const },
                },
              },
            },
          },
        ],
      }
    : {};

  const resources = await prisma.orm.public.Resource.where((row) =>
    whereFromObject(row, whereCondition),
  )
    .include("bonusActivities", (related31) =>
      related31
        .select("id", "title", "type", "order")
        .orderBy((row) => row.order.asc()),
    )
    .offset(getPagination(page, limit))
    .limit(limit)
    .all();

  const totaltResources = await prisma.orm.public.Resource.where((row) =>
    whereFromObject(row, whereCondition),
  )
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
