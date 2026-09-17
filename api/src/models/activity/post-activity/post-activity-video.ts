import { whereFromObject } from "../../../utils/prisma-query.ts";
import type { Activity, BonusActivity } from "../../../prisma/model-types.ts";
import { prisma } from "../../../utils/db.ts";

export default async function postActivityVideo(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  url: string,
  parentType?: "resource" | "lesson",
) {
  let existingParent:
    | { id: number; activities: Activity[] }
    | { id: number; bonusActivities: BonusActivity[] }
    | null = null;

  if (parentType === "lesson") {
    existingParent = await prisma.orm.public.Lesson.where((row) =>
      whereFromObject(row, { id: lessonId }),
    )
      .select("id")
      .include("activities")
      .first();
  } else {
    existingParent = await prisma.orm.public.Resource.where((row) =>
      whereFromObject(row, { id: lessonId }),
    )
      .select("id")
      .include("bonusActivities")
      .first();
  }

  if (!existingParent) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAuthor = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  ).first();

  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let createdActivity: unknown;

  if (parentType === "lesson") {
    createdActivity = await prisma.orm.public.Activity.create({
      type: "video",
      order: (existingParent as { id: number; activities: Activity[] })
        .activities.length,
      title,
      url,
      lesson: (relation) =>
        relation.connect({
          id: lessonId,
        }),
      author: (relation) =>
        relation.connect({
          id: existingAuthor.id,
        }),
    });
  } else {
    const createdActivity = await prisma.orm.public.BonusActivity.create({
      type: "video",
      order: (
        existingParent as { id: number; bonusActivities: BonusActivity[] }
      ).bonusActivities.length,
      title,
      url,
      resource: (relation) =>
        relation.connect({
          id: lessonId,
        }),
      admin: (relation) =>
        relation.connect({
          id: existingAuthor.id,
        }),
    });
  }

  return createdActivity;
}
