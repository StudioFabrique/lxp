import { Lesson, Resource, Activity, BonusActivity } from "@prisma/client";
import { prisma } from "../../../utils/db";

export default async function postIframe(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  url: string,
  parent: "lesson" | "resource" = "lesson",
) {
  let existingParent: Lesson | Resource | null = null;

  if (parent === "lesson")
    existingParent = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { activities: true },
    });
  else if (parent === "resource")
    existingParent = await prisma.resource.findFirst({
      where: { id: lessonId },
      include: { bonusActivities: true },
    });

  if (!existingParent)
    throw { message: "L'id de la lesson n'existe pas", status: 404 };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  let createdActivity: Activity | BonusActivity | null;

  if (parent === "lesson") {
    createdActivity = await prisma.activity.create({
      data: {
        title,
        order: (existingParent as Lesson & { activities: Activity[] })
          .activities.length,
        type: "iframe",
        lesson: {
          connect: { id: existingParent.id },
        },
        url,
        author: {
          connect: {
            id: existingAuthor.id,
          },
        },
      },
    });
    return createdActivity;
  } else if (parent === "resource") {
    createdActivity = await prisma.bonusActivity.create({
      data: {
        title,
        order: (
          existingParent as Resource & { bonusActivities: BonusActivity[] }
        ).bonusActivities.length,
        type: "iframe",
        resource: {
          connect: { id: existingParent.id },
        },
        url,
        admin: {
          connect: {
            id: existingAuthor.id,
          },
        },
      },
    });
    return createdActivity;
  } else return;
}
