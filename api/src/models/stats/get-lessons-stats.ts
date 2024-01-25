import { prisma } from "../../utils/db";

export default async function getLessonsStats() {
  const lessons = await prisma.lesson.findMany({
    select: {
      title: true,
      readBy: true,
    },
  });

  const result = lessons.map((item) => ({
    title: item.title,
    total: item.readBy.length,
  }));
  return result;
}
