import { prisma } from "../../utils/db";

export default async function deleteTag(id: number) {
  await prisma.tagsOnFormation.deleteMany({
    where: { tagId: id },
  });

  await prisma.tagsOnParcours.deleteMany({
    where: { tagId: id },
  });

  await prisma.tagsOnCourse.deleteMany({
    where: { tagId: id },
  });

  await prisma.lesson.deleteMany({
    where: { tagId: id },
  });

  await prisma.tag.delete({
    where: { id },
  });
}
