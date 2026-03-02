import { Admin, Resource, Tag } from "@prisma/client";
import { getSoftColor } from "../../helpers/getSoftColors";
import { prisma } from "../../utils/db";
import { IRole } from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";

export default async function putResource(
  userId: string,
  resourceId: number,
  title: string,
  description: string,
  tags: string[],
  filename: string | null,
  roles: IRole[],
) {
  let updatedResource: Resource | null = null;
  const existingResource = await prisma.resource.findFirst({
    where: { title },
  });

  if (!existingResource)
    throw { message: "La ressource n'existe pas", status: 404 };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const mongoUser = await User.findById(userId);

  if (!mongoUser) throw { message: "Utilisateur non trouvé", status: 404 };

  if (
    existingAuthor.id !== existingResource.adminId &&
    !roles.find((r) => r.rank === 1)
  )
    throw {
      statusCode: 405,
      message:
        "Vous ne pouvez pas modifier une ressource dont vous n'êtes pas l'auteur.",
    };

  const existingTagIds = await prisma.tag.findMany({
    where: { name: { in: tags, mode: "insensitive" } },
  });

  let remainingTags = tags.filter(
    (tag) =>
      !existingTagIds.some(
        (existingTag) => existingTag.name.toLowerCase() === tag.toLowerCase(),
      ),
  );

  const newTags = remainingTags.map((tag) => ({
    name: tag,
    color: getSoftColor(),
  }));

  if (newTags.length > 0) {
    await prisma.tag.createMany({
      data: newTags,
    });
    const newlyCreatedTags =
      (await prisma.tag.findMany({
        where: { name: { in: remainingTags } },
      })) ?? [];

    const tagsToAdd = [...existingTagIds, ...newlyCreatedTags];
    updatedResource = await updateResource(
      existingAuthor,
      mongoUser,
      resourceId,
      title,
      description,
      tagsToAdd,
      filename,
    );
  } else
    updatedResource = await updateResource(
      existingAuthor,
      mongoUser,
      resourceId,
      title,
      description,
      existingTagIds,
      filename,
    );

  return {
    message: "Ressource mise à jour avec succès",
    success: true,
    resource: updatedResource,
  };
}

async function updateResource(
  existingAuthor: Admin,
  mongoUser: any,
  resourceId: number,
  title: string,
  description: string,
  tags: Tag[],
  filename: string | null,
) {
  return await prisma.resource.update({
    where: { id: resourceId },
    data: {
      title,
      description,
      admin: { connect: { id: existingAuthor.id } },
      author: mongoUser.firstname + " " + mongoUser.lastname,
      imageUrl: filename,
      tags: {
        deleteMany: {}, // Supprime toutes les associations existantes
        create: tags.map((tag) => ({
          tag: { connect: { id: tag.id } },
        })),
      },
    },
  });
}
