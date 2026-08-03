import { prisma } from "../../utils/db";
import {
  collectUnusedActivityFiles,
  deleteActivityFiles,
} from "../../helpers/activity-file-cleanup";
import deleteActivity from "../activity/delete-activity/delete-activity";

export default async function deleteResource(
  resourceId: number,
  userId: string,
) {
  const existingResource = await prisma.resource.findFirst({
    where: { id: resourceId },
    include: {
      bonusActivities: { select: { id: true, type: true } },
    },
  });

  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  for (const activity of existingResource.bonusActivities) {
    await deleteActivity(activity.id, activity.type, "resource");
  }

  const filesToDelete = await prisma.$transaction(async (tx) => {
    await tx.resource.delete({
      where: { id: resourceId },
    });

    if (!existingResource.imageUrl) return [];

    return collectUnusedActivityFiles(tx, [
      {
        url: existingResource.imageUrl,
        type: "image",
        trackedInMediatheque: true,
      },
    ]);
  });

  await deleteActivityFiles(filesToDelete);
  return;
}
