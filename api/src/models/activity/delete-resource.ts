import path from "path";
import fs from "fs";
import { prisma } from "../../utils/db";

export default async function deleteResource(
  resourceId: number,
  userId: string
) {
  const existingResource = await prisma.resourceActivity.findFirst({
    where: { id: resourceId },
    select: { activity: { select: { authorId: true } } },
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

  const deletedResource = await prisma.resourceActivity.delete({
    where: { id: resourceId },
  });

  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "activities",
    "files"
  );

  // supprime le fichier
  await fs.promises.unlink(`${filePath}/${deletedResource.url}`);

  return deletedResource;
}
