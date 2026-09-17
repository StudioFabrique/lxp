import { and } from "@prisma/orm-postgres/orm-client";
import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import type { Admin, Resource, Tag } from "../../prisma/model-types.ts";
import { getSoftColor } from "../../helpers/getSoftColors.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { tagOwnerFor } from "../tag/tag-access.ts";

export default async function putResource(
  userId: string,
  resourceId: number,
  title: string,
  description: string,
  tags: string[],
  filename: string | null,
  isAdmin: boolean,
) {
  let updatedResource: Resource | null = null;
  const existingResource = await prisma.orm.public.Resource.where({
    id: resourceId,
  }).first();

  if (!existingResource)
    throw { message: "La ressource n'existe pas", statusCode: 404 };

  const duplicate = await prisma.orm.public.Resource.where((row) =>
    and(row.title.eq(title), row.id.neq(resourceId)),
  ).first();
  if (duplicate)
    throw {
      message: "Une ressource portant ce nom existe déjà",
      statusCode: 409,
    };

  const existingAuthor = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const mongoUser = await User.findById(userId);

  if (!mongoUser) throw { message: "Utilisateur non trouvé", status: 404 };

  const existingTagIds = await prisma.orm.public.Tag.where((row) =>
    row.name.in(tags),
  ).all();

  let remainingTags = tags.filter(
    (tag) =>
      !existingTagIds.some(
        (existingTag) => existingTag.name.toLowerCase() === tag.toLowerCase(),
      ),
  );

  const newTags = remainingTags.map((tag) => ({
    name: tag,
    color: getSoftColor(),
    createdBy: tagOwnerFor({ userId, isAdmin }),
  }));

  if (newTags.length > 0) {
    await prisma.orm.public.Tag.createAndCount(newTags).then((count) => ({
      count,
    }));
    const newlyCreatedTags =
      (await prisma.orm.public.Tag.where((row) =>
        row.name.in(remainingTags),
      ).all()) ?? [];

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
  return await prisma.orm.public.Resource.where({ id: resourceId })
    .update({
      title,
      description,
      admin: (relation) => relation.connect({ id: existingAuthor.id }),
      author: mongoUser.firstname + " " + mongoUser.lastname,
      ...(filename ? { imageUrl: filename } : {}),
      tags: (relation) =>
        relation.create(tags.map((tag) => ({ tagId: tag.id }))),
    })
    .then(requireDatabaseRow);
}
