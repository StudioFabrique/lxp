import { prisma } from "../../utils/db";

export default async function getPaginateSearchTags(
  page: number,
  limit: number,
  stype: string | null,
  sdir: "asc" | "desc",
  entity: string | null,
  value: string | null,
) {
  try {
    const skip = (page - 1) * limit;

    const orderBy =
      stype && stype !== "null"
        ? { [stype]: sdir }
        : { createdAt: "desc" as const };

    const where =
      entity && value
        ? {
            [entity]: {
              contains: value,
              mode: "insensitive",
            },
          }
        : {};

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        skip,
        take: limit,
        orderBy,
        where,
      }),
      prisma.tag.count({
        where,
      }),
    ]);

    return {
      list: tags,
      total,
    };
  } catch (error) {
    throw error;
  }
}
