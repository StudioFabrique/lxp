import { prisma } from "../../utils/db";

export default async function postManyTags(
  tags: [{ name: string; color: string }]
) {
  let tmpTags = Array<any>();

  const existingTags = await prisma.tag.findMany();
  for (const tag of tags) {
    if (
      !existingTags.find(
        (item) => item.name.toLowerCase() === tag.name.toLowerCase()
      )
    ) {
      tmpTags = [...tmpTags, tag];
    }
  }
  await prisma.tag.createMany({
    data: tmpTags,
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
