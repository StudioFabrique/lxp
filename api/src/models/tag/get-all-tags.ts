import { prisma } from "../../utils/db.ts";

async function getAllTags() {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (tags && tags.length > 0) {
    return tags;
  } else {
    return [];
  }
}

export default getAllTags;
