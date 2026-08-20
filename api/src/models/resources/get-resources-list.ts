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
  // Construire la condition conditionnellement
  const whereCondition = searchTerm
    ? {
        tags: {
          some: {
            tag: {
              name: {
                contains: searchTerm,
                mode: "insensitive" as const,
              },
            },
          },
        },
      }
    : {};

  const resources = await prisma.resource.findMany({
    where: whereCondition,
    orderBy: sortClause(stype, sdir),
    skip: getPagination(page, limit),
    take: limit,
  });

  const totaltResources = await prisma.resource.count({
    where: whereCondition,
  });

  return { resources, totaltResources };
}
