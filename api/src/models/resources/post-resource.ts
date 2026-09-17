import { mongo } from "mongoose";
import { prisma, type NestedConnect } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getSoftColor } from "../../helpers/getSoftColors.ts";
import { tagOwnerFor } from "../tag/tag-access.ts";

export default async function postResource(
  userId: string,
  title: string,
  description: string,
  tags: string[],
  filename: string | null,
  isAdmin: boolean,
) {
  const existingResource = await prisma.orm.public.Resource.where({
    title,
  }).first();

  const existingAuthor = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const mongoUser = await User.findById(userId);

  if (!mongoUser) throw { message: "Utilisateur non trouvé", status: 404 };

  if (existingResource)
    throw { message: "Une ressource portant ce nom existe déjà", status: 406 };

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
  }

  const newlyCreatedTags = await prisma.orm.public.Tag.where((row) =>
    row.name.in(remainingTags),
  ).all();

  const tagsToAdd = [...existingTagIds, ...newlyCreatedTags];

  const createdResource = await prisma.orm.public.Resource.create({
    title,
    description,
    admin: (relation) => relation.connect({ id: existingAuthor.id }),
    author: mongoUser.firstname + " " + mongoUser.lastname,
    imageUrl: filename,
    tags: (relation) =>
      relation.create(
        tagsToAdd.map((tag) => {
          return {
            tag: (tagRelation: NestedConnect<"Tag">) =>
              tagRelation.connect({ id: tag.id }),
          };
        }),
      ),
  });
  return {
    message: "Ressource créée avec succès",
    success: true,
    resource: createdResource,
  };
}
