import { prisma } from "../../utils/db";

export default async function getParcoursList() {
  const parcours = await prisma.parcours.findMany({
    select: {
      id: true,
      title: true,
    },
  });
  return parcours;
}
