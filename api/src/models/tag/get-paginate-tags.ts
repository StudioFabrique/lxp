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
      }),
      prisma.tag.count(),
    ]);

    return {
      list: tags,
      total,
    };
  } catch (error) {
    throw error;
  }
}
