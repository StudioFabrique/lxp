import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateParcoursDates(
  parcoursId: number,
  start: string,
  end: string
) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const updatedDates = await prisma.parcours.update({
    where: { id: parcoursId },
    data: {
      startDate,
      endDate,
    },
  });
  console.log(updatedDates);
  return updatedDates;
}

export default updateParcoursDates;
