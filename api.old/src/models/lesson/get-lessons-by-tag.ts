import { prisma } from "../../utils/db";

async function getLessonsByTag(tagId: number) {
  const lessons = await prisma.lesson.findMany({
    where: { tagId },
  });
  return lessons;
}

export default getLessonsByTag;
