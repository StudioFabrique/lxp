import { prisma } from "../../utils/db";

export default async function deleteTag(id: number) {
  await prisma.tag.delete({
    where: { id },
  });
}
