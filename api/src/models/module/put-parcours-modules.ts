import { prisma } from "../../utils/db";

export default function putParcoursModules(
  parcoursId: number,
  moduleIds: number[],
) {
  return prisma.parcours.update({
    where: { id: parcoursId },
    data: {
      modules: {
        connect: moduleIds.map((id) => ({ id })),
      },
    },
    select: { modules: { select: { id: true } } },
  });
}
