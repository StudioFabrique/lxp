import { Activity, BonusActivity } from "../../../../generated/prisma/client";
import { prisma } from "../../../utils/db";

export default async function putIframe(
  activityId: number,
  userId: string,
  title: string,
  description: string,
  url: string,
  parent: "lesson" | "resource",
) {
  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  let existingContent: Activity | BonusActivity | null = null;

  if (parent === "lesson") {
    existingContent = await prisma.activity.findFirst({
      where: { id: activityId },
    });
  } else if (parent === "resource") {
    existingContent = await prisma.bonusActivity.findFirst({
      where: { id: activityId },
    });
  }

  if (!existingContent) throw { message: "Contenu non trouvé", status: 404 };

  let updatedActivity: Activity | BonusActivity | null = null;

  if (parent === "lesson") {
    updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        title,
        type: "iframe",
        url,
        author: {
          connect: {
            id: existingAuthor.id,
          },
        },
      },
    });
  } else if (parent === "resource") {
    updatedActivity = await prisma.bonusActivity.update({
      where: { id: activityId },
      data: {
        title,
        type: "iframe",
        url,
        admin: {
          connect: {
            id: existingAuthor.id,
          },
        },
      },
    });
  }

  return updatedActivity;
}
