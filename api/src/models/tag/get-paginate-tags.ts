import { prisma } from "../../utils/db";

export default async function getPaginateTags(
  page: number,
  limit: number,
  stype: string | null,
  sdir: "asc" | "desc",
) {
  try {
    const skip = (page - 1) * limit;

    const orderBy =
      stype && stype !== "null"
        ? { [stype]: sdir }
        : { createdAt: "desc" as const };

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: {
              lessons: true,
              courses: true,
              formations: true,
              parcours: true,
            },
          },
          formations: {
            select: {
              formation: {
                select: {
                  id: true,
                  title: true,
                  parcours: {
                    select: {
                      id: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.tag.count(),
    ]);

    const tagsWithUsage = tags.map((tag) => ({
      ...tag,
      totalUses:
        tag._count.lessons +
        tag._count.courses +
        tag._count.formations +
        tag._count.parcours,
      parcours: tag.formations.flatMap((f) => f.formation.parcours),
    }));

    return {
      list: tagsWithUsage,
      total,
    };
  } catch (error) {
    throw error;
  }
}
