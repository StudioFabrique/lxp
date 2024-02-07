export default async function getLastLessonsRead(userIdMdb: string) {
  const lessons = await prisma?.lessonRead.findMany({
    where: { student: { idMdb: userIdMdb } },
    include: {
      lesson: {
        select: { id: true, title: true, course: { select: { title: true } } },
      },
    },
    orderBy: { beganAt: "desc" },
    take: 4,
  });

  return lessons;
}
