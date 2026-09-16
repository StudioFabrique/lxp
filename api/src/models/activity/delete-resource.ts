import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
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
  const existingResource =
    parent === "resource"
      ? await prisma.orm.public.ResourceBonusActivity.where((row) =>
          whereFromObject(row, { id: resourceId }),
        )
          .select("url")
          .first()
      : await prisma.orm.public.ResourceActivity.where((row) =>
          whereFromObject(row, { id: resourceId }),
        )
          .select("url")
          .first();
  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  const existingAuthor = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  ).first();
  if (!existingAuthor)
    throw {
      statusCode: 404,
      message: "L'auteur de la ressource n'existe pas.",
    };
  const filesToDelete = await prisma.transaction(async (tx) => {
    const deletedResource =
      parent === "resource"
        ? await tx.orm.public.ResourceBonusActivity.where((row) =>
            whereFromObject(row, { id: resourceId }),
          )
            .delete()
            .then(requireDatabaseRow)
        : await tx.orm.public.ResourceActivity.where((row) =>
            whereFromObject(row, { id: resourceId }),
          )
            .delete()
            .then(requireDatabaseRow);

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
