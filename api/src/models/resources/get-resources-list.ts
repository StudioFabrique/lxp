import { prisma } from "../../utils/db";
import { getPagination } from "../../utils/services/getPagination";

export default async function getResourcesList(
  stype: string,
  sdir: string,
  page: number,
  limit: number
) {
  const resources = await prisma.resource.findMany({
    orderBy: { [stype]: sdir },
    skip: getPagination(page, limit),
    take: limit,
  });
  const totaltResources = await prisma.resource.count();
  return { resources, totaltResources };
}
