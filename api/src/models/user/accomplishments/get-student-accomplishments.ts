import { prisma } from "../../../utils/db";

export default async function getStudentAccomplishments(studentMdbId: string) {
  const lastFeedback = await prisma.accomplishment.findMany({
    where: {
      student: {
        idMdb: studentMdbId,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      accomplishedAt: true,
    },
    orderBy: { accomplishedAt: "desc" },
    take: 5,
  });

  return lastFeedback;
}
