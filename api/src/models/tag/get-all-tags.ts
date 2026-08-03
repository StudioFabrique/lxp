import { prisma } from "../../utils/db.ts";

async function getAllTags() {
  const tags = await prisma.tag.findMany();

  if (tags && tags.length > 0) {
    return tags;
  } else {
    return [];
  }
}

export default getAllTags;
