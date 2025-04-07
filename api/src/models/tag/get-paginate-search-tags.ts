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
        include: {
          _count: {
            select: {
              lessons: true,
              courses: true,
              formations: true,
              parcours: true,
            },
          },
        },
      }),
      prisma.tag.count({
        where,
      }),
    ]);

    const tagsWithUsage = tags.map((tag) => ({
      ...tag,
      totalUses:
        tag._count.lessons +
        tag._count.courses +
        tag._count.formations +
        tag._count.parcours,
    }));

    return {
      list: tagsWithUsage,
      total,
    };
  } catch (error) {
    throw error;
  }
}
