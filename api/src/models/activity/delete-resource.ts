import { prisma } from "../../utils/db";
import {
  collectUnusedActivityFiles,
  deleteActivityFiles,
} from "../../helpers/activity-file-cleanup";

export default async function deleteResource(
  resourceId: number,
  userId: string
) {
  const existingResource = await prisma.resourceActivity.findFirst({
    where: { id: resourceId },
    select: { url: true, activity: { select: { authorId: true } } },
  });
  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  const existingAuthor = await prisma.admin.findFirst({
    where: { id: existingResource.activity.authorId },
  });
  if (!existingAuthor)
    throw {
      statusCode: 404,
      message: "L'auteur de la ressource n'existe pas.",
    };
  if (existingAuthor.idMdb !== userId)
    throw {
      statusCode: 406,
      message: "Vous n'êtes pas le propriétaire de cette ressource.",
    };

  const filesToDelete = await prisma.$transaction(async (tx) => {
    const deletedResource = await tx.resourceActivity.delete({
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
