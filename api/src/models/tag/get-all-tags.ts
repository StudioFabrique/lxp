import { prisma } from "../../utils/db.ts";

async function getAllTags() {
  const tags = await prisma.orm.public.Tag.select(
    "id",
    "name",
    "color",
    "createdAt",
    "updatedAt",
  ).all();

  if (tags && tags.length > 0) {
    return tags;
  } else {
    return [];
  }
}

export default getAllTags;
