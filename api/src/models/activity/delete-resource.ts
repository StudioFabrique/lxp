import { prisma } from "../../utils/db.ts";
import {
  collectUnusedActivityFiles,
  deleteActivityFiles,
} from "../../helpers/activity-file-cleanup.ts";

export default async function deleteResource(
  resourceId: number,
  userId: string,
  parent: "lesson" | "resource" = "lesson",
) {
  const existingResource = parent === "resource"
    ? await prisma.resourceBonusActivity.findFirst({
        where: { id: resourceId },
        select: { url: true },
      })
    : await prisma.resourceActivity.findFirst({
    where: { id: resourceId },
    select: { url: true },
  });
  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });
  if (!existingAuthor)
    throw {
      statusCode: 404,
      message: "L'auteur de la ressource n'existe pas.",
    };
  const filesToDelete = await prisma.$transaction(async (tx) => {
    const deletedResource = parent === "resource"
      ? await tx.resourceBonusActivity.delete({ where: { id: resourceId } })
      : await tx.resourceActivity.delete({
      where: { id: resourceId },
    });

    const files = await collectUnusedActivityFiles(tx, [
      {
        url: existingResource.url,
        type: "resource",
        trackedInMediatheque: true,
      },
    ]);

    return { deletedResource, files };
  });

  await deleteActivityFiles(filesToDelete.files);
  return filesToDelete.deletedResource;
}
