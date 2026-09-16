import { prisma } from "../../utils/db.ts";
import { canManageTag, type TagActor } from "./tag-access.ts";

export default async function getPaginateTags(
  page: number,
  limit: number,
  stype: string | null,
  sdir: "asc" | "desc",
  actor: TagActor,
) {
  try {
    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      prisma.orm.public.Tag.include("formations", (related39) =>
        related39.include("formation", (related40) =>
          related40
            .select("id", "title")
            .include("parcours", (related41) =>
              related41.select("id", "title"),
            ),
        ),
      )
        .include("lessons", (related) => related.select("id"))
        .include("courses", (related) => related.select("courseId"))
        .include("parcours", (related) => related.select("parcoursId"))
        .orderBy((row) => {
          if (stype === "name") return sdir === "asc" ? row.name.asc() : row.name.desc();
          if (stype === "color") return sdir === "asc" ? row.color.asc() : row.color.desc();
          if (stype === "updatedAt") return sdir === "asc" ? row.updatedAt.asc() : row.updatedAt.desc();
          return sdir === "asc" && stype === "createdAt" ? row.createdAt.asc() : row.createdAt.desc();
        })
        .offset(skip)
        .limit(limit)
        .all(),
      prisma.orm.public.Tag.aggregate((aggregate) => ({
        total: aggregate.count(),
      })).then(({ total }) => total),
    ]);

    const tagsWithUsage = tags.map((tag) => {
      const { createdBy, lessons, courses, parcours: taggedParcours, ...publicTag } = tag;
      return {
        ...publicTag,
        canDelete: canManageTag({ createdBy }, actor),
        canUpdate: canManageTag({ createdBy }, actor),
        totalUses: lessons.length + courses.length + tag.formations.length + taggedParcours.length,
        parcours: tag.formations.flatMap((f) => f.formation!.parcours),
      };
    });

    return {
      list: tagsWithUsage,
      total,
    };
  } catch (error) {
    throw error;
  }
}
