import { prisma } from "../../utils/db";

export default async function postManyTags(
  tags: { name: string; color: string }[],
) {
  const normalizedTags = tags.map((tag) => ({
    name: tag.name.trim(),
    color: tag.color,
  }));
  const uniqueTags = normalizedTags.filter(
    (tag, index, list) =>
      list.findIndex(
        (candidate) =>
          candidate.name.toLocaleLowerCase() === tag.name.toLocaleLowerCase(),
      ) === index,
  );
  const tagNames = uniqueTags.map((tag) => tag.name);

  const existingTags = await prisma.tag.findMany({
    where: {
      name: { in: tagNames, mode: "insensitive" },
    },
  });

  if (existingTags.length > 0) {
    const duplicateNames = existingTags.map((tag) => tag.name).join(", ");
    throw {
      statusCode: 409,
      message: `Le nom de tag est déjà utilisé : ${duplicateNames}`,
    };
  }

  const remainingTags = uniqueTags.filter(
    (tag) =>
      !existingTags.some(
        (existingTag) =>
          existingTag.name.toLowerCase() === tag.name.toLowerCase(),
      ),
  );

  if (remainingTags.length > 0) {
    await prisma.tag.createMany({
      data: remainingTags,
      skipDuplicates: true,
    });
  }

  return prisma.tag.findMany({
    where: {
      name: { in: tagNames, mode: "insensitive" },
    },
  });
}
