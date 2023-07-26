import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllTags() {
  const tags = await prisma.tag.findMany();

  if (tags && tags.length > 0) {
    return tags;
  } else {
    return [];
  }
}

export default getAllTags;
