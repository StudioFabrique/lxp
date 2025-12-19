import { prisma } from "../../utils/db";
import { getPagination } from "../../utils/services/getPagination";

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
    orderBy: { [stype]: sdir },
    skip: getPagination(page, limit),
    take: limit,
  });

  const totaltResources = await prisma.resource.count({
    where: whereCondition,
  });

  return { resources, totaltResources };
}
