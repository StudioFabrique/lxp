import { prisma } from "../../utils/db";

export default async function getFormationList() {
  const formations = await prisma.formation.findMany({
    select: {
      id: true,
      title: true,
    },
  });
  return formations;
}
