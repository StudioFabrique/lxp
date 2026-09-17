import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import { canManageTag, type TagActor } from "./tag-access.ts";

export default async function getPaginateSearchTags(
  page: number,
  limit: number,
  stype: string | null,
  sdir: "asc" | "desc",
  entity: string | null,
  value: string | null,
  actor: TagActor,
) {
  try {
    const skip = (page - 1) * limit;

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
      prisma.orm.public.Tag.where((row) => whereFromObject(row, where))
        .include("formations", (related36) =>
          related36.include("formation", (related37) =>
            related37
              .select("id", "title")
              .include("parcours", (related38) =>
                related38.select("id", "title"),
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
      prisma.orm.public.Tag.where((row) => whereFromObject(row, where))
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total),
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
