export default async function getLastLessonsRead(userIdMdb: string) {
  const lessons = prisma?.lessonRead.findMany({
    where: { student: { idMdb: userIdMdb } },
    orderBy: { beganAt: "desc" },
    take: 4,
  });

  return lessons;
}
