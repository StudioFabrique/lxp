import { prisma } from "../../utils/db.ts";

export default async function putTag(id: number, name: string) {
  const updatedTag = await prisma.tag.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  return updatedTag;
}
