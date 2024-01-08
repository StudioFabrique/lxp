import { prisma } from "../../utils/db";

async function getAllTags() {
  const tags = await prisma.tag.findMany();

  if (tags && tags.length > 0) {
    return tags;
  } else {
    return [];
  }
}

export default getAllTags;
