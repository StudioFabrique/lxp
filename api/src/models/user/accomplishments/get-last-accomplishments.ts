import Group from "../../../utils/interfaces/db/group";

export default async function getLastAccomplishments(studentMdbId: string) {
  const studentsIdsMdbInSameGroup = (
    await Group.find({ users: studentMdbId })
  ).reduce((acc, group) => acc.concat(group.users), []);

  const lastFeedback = await prisma?.accomplishment.findMany({
    where: {
      student: {
        idMdb: { in: studentsIdsMdbInSameGroup, not: studentMdbId },
      },
      hasBeenCongratulated: false,
    },
    select: {
      id: true,
      name: true,
      description: true,
      student: { select: { id: true, idMdb: true } },
    },
    orderBy: { accomplishedAt: "desc" },
    distinct: "studentId",
    take: 5,
  });

  return lastFeedback;
}
