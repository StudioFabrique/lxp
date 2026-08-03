import { prisma } from "../../utils/db.ts";

export default async function getParcoursModules(parcoursId: number) {
  return prisma.module.findMany({
    where: { parcoursId: +parcoursId },
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true },
  });
}
