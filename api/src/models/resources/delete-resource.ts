import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";
import {
  collectUnusedActivityFiles,
  deleteActivityFiles,
} from "../../helpers/activity-file-cleanup.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";

export default async function deleteResource(
  resourceId: number,
  userId: string,
) {
  const existingResource = await prisma.orm.public.Resource.where({
    id: resourceId,
  })
    .include("bonusActivities", (related26) => related26.select("id", "type"))
    .first();

  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  const existingUser = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  for (const activity of existingResource.bonusActivities) {
    await deleteActivity(activity.id, activity.type, "resource");
  }

  const filesToDelete = await prisma.transaction(async (tx) => {
    await tx.orm.public.Resource.where({ id: resourceId })
      .delete()
      .then(requireDatabaseRow);

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
