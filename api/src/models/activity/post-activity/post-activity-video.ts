import { type Activity, type BonusActivity } from "@prisma/client";
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
    existingParent = await prisma.lesson.findFirst({
      where: { id: lessonId },
      select: { id: true, activities: true },
    });
  } else {
    existingParent = await prisma.resource.findFirst({
      where: { id: lessonId },
      select: { id: true, bonusActivities: true },
    });
  }

  if (!existingParent) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  let createdActivity: unknown;

  if (parentType === "lesson") {
    createdActivity = await prisma.activity.create({
      data: {
        type: "video",
        order: (existingParent as { id: number; activities: Activity[] })
          .activities.length,
        title,
        url,
        lesson: {
          connect: {
            id: lessonId,
          },
        },
        author: {
          connect: {
            id: existingAuthor.id,
          },
        },
      },
    });
  } else {
    const createdActivity = await prisma.bonusActivity.create({
      data: {
        type: "video",
        order: (
          existingParent as { id: number; bonusActivities: BonusActivity[] }
        ).bonusActivities.length,
        title,
        url,
        resource: {
          connect: {
            id: lessonId,
          },
        },
        admin: {
          connect: {
            id: existingAuthor.id,
          },
        },
      },
    });
  }

  return createdActivity;
}
