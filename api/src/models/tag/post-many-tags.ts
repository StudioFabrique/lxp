import { prisma } from "../../utils/db";

export default async function postManyTags(
  tags: [{ name: string; color: string }]
) {
  console.log({ tags });

  const tmpTags = tags.map((tag) => tag.name);

  const existingTags = await prisma.tag.findMany({
    where: {
      name: { in: tmpTags, mode: "insensitive" },
    },
  });

  let remainingTags = tags.filter(
    (tag) =>
      !existingTags.some(
        (existingTag) =>
          existingTag.name.toLowerCase() === tag.name.toLowerCase()
      )
  );

  await prisma.tag.createMany({
    data: remainingTags,
  });

  const newTags = await prisma.tag.findMany({
    where: {
      OR: tags.map((tag) => ({
        name: tag.name,
      })),
    },
  });
  return newTags;
}
