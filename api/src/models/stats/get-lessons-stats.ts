import { prisma } from "../../utils/db";

export default async function getLessonsStats() {
  const lessons = await prisma.lesson.findMany({
    select: {
      title: true,
      readBy: true,
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  const result = lessons.map((item) => ({
    title: item.title,
    total: item.readBy.length,
  }));
  return result;
}
