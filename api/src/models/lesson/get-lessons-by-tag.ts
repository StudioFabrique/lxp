import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

type ResultTag = { id: number; name: string; color: string };

type Result = {
  id: number;
  title: string;
  activitiesCount: number;
  source: "resource" | "lesson";
  sourceTitle?: string;
  tag?: ResultTag;
};

/**
 * Leçons et ressources à importer. Sans `tagId`, tous les tags sont parcourus : `limit` borne alors
 * chaque source (ressources, leçons) pour ne pas renvoyer toute la bibliothèque.
 */
export default async function getLessonsByTag(
  tagId: number | null,
  includeCourseContents = false,
  supplementaryResources = false,
  scope: AccessScope = null,
  limit?: number,
) {
  // Les leçons sont bornées au périmètre de l'appelant ; les ressources, elles,
  // forment une bibliothèque transverse sans rattachement à un parcours et
  // restent donc gouvernées par la seule permission `read:resource`.
  const filterLessons = (query: typeof prisma.orm.public.Lesson) =>
    query.where((lesson) =>
      and(
        tagId === null ? lesson.id.gt(0) : lesson.tagId.eq(tagId),
        ...(scope
          ? [
              lesson.course.some((course) =>
                course.module.some((module) =>
                  scope.moduleIds === null
                    ? module.parcoursId.in(scope.parcoursIds)
                    : module.id.in(scope.moduleIds),
                ),
              ),
            ]
          : []),
      ),
    );
  if (supplementaryResources) {
    const resourceQuery = prisma.orm.public.Resource.where((row) =>
      tagId === null
        ? row.id.gt(0)
        : row.tags.some((tags) => tags.tagId.eq(tagId)),
    )
      .select("id", "title")
      .include("bonusActivities", (related123) => related123.select("id"))
      .include("tags", (related127) => related127.include("tag"))
      .orderBy((row) => row.title.asc());
    const resources = await (limit ? resourceQuery.limit(limit) : resourceQuery).all();

    const resourceResults: Result[] = resources.map((resource) => {
      // Une ressource peut porter plusieurs tags : celui recherché, sinon le premier.
      const resourceTag = (
        resource.tags.find((item) => item.tagId === tagId) ?? resource.tags[0]
      )?.tag;
      return {
        id: resource.id,
        title: resource.title,
        activitiesCount: resource.bonusActivities.length,
        source: "resource",
        tag: resourceTag && {
          id: resourceTag.id,
          name: resourceTag.name,
          color: resourceTag.color,
        },
      };
    });

    if (!includeCourseContents) return resourceResults;

    const lessonQuery = filterLessons(prisma.orm.public.Lesson)
      .select("id", "title")
      .include("activities", (related124) => related124.select("id"))
      .include("course", (related125) => related125.select("title"))
      .include("tag", (related128) => related128.select("id", "name", "color"))
      .orderBy((row) => row.title.asc());
    const lessons = await (limit ? lessonQuery.limit(limit) : lessonQuery).all();

    return [
      ...resourceResults,
      ...lessons.map((lesson): Result => ({
        id: lesson.id,
        title: lesson.title,
        activitiesCount: lesson.activities.length,
        source: "lesson",
        sourceTitle: lesson.course!.title,
        tag: lesson.tag ?? undefined,
      })),
    ];
  }

  const lessons = await filterLessons(prisma.orm.public.Lesson)
    .select("id", "title")
    .include("activities", (related126) => related126.select("id"))
    .all();

  let result: Result[] = [];

  for (const lesson of lessons) {
    if (
      !result.find(
        (item: Result) =>
          item.title === lesson.title &&
          item.activitiesCount === lesson.activities.length,
      )
    ) {
      result = [
        ...result,
        {
          id: lesson.id,
          title: lesson.title,
          activitiesCount: lesson.activities.length,
          source: "lesson",
        },
      ];
    }
  }

  return result;
}
