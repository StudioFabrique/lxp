import { prisma } from "../../utils/db.ts";
import { tagOwnerFor, type TagActor } from "./tag-access.ts";

export default async function postManyTags(
  tags: { name: string; color: string }[],
  actor: TagActor,
) {
  const normalizedTags = tags.map((tag) => ({
    name: tag.name.trim(),
    color: tag.color,
    createdBy: tagOwnerFor(actor),
  }));
  const uniqueTags = normalizedTags.filter(
    (tag, index, list) =>
      list.findIndex(
        (candidate) =>
          candidate.name.toLocaleLowerCase() === tag.name.toLocaleLowerCase(),
      ) === index,
  );
  // Depuis la migration keep_display_label_case, les noms sont stockés tels que saisis.
  const tagNames = uniqueTags.map((tag) => tag.name);

  const existingTags = await prisma.orm.public.Tag.where((row) =>
    row.name.in(tagNames),
  ).all();

  if (existingTags.length > 0) {
    const duplicateNames = existingTags.map((tag) => tag.name).join(", ");
    throw {
      statusCode: 409,
      message: `Le nom de tag est déjà utilisé : ${duplicateNames}`,
    };
  }

  if (uniqueTags.length > 0) {
    await prisma.orm.public.Tag.createAndCount(uniqueTags);
  }

  return prisma.orm.public.Tag.where((row) => row.name.in(tagNames))
    .select("id", "name", "color", "createdAt", "updatedAt")
    .all();
}
