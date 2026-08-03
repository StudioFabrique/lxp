import { prisma } from "../../utils/db.ts";

export default async function updateDatesModule(
  moduleId: number,
  minDate: string,
  maxDate: string,
) {
  const module = await prisma.module.findUnique({
    where: { id: +moduleId },
    select: {
      parcours: { select: { startDate: true, endDate: true } },
    },
  });

  if (
    !module?.parcours.startDate ||
    !module.parcours.endDate
  ) {
    return null;
  }

  return prisma.module.update({
    where: { id: +moduleId },
    data: { minDate: new Date(minDate), maxDate: new Date(maxDate) },
  });
}
