import { prisma } from "../../utils/db";

export default async function updateDatesModule(
  moduleId: number,
  minDate: string,
  maxDate: string
) {
  const datesParcours = (
    await prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        parcours: {
          select: { parcours: { select: { startDate: true, endDate: true } } },
        },
      },
    })
  )?.parcours[0].parcours;

  if (!datesParcours || !datesParcours.startDate || !datesParcours.endDate) {
    return null;
  }

  if (
    new Date(minDate) < datesParcours.startDate ||
    new Date(maxDate) > datesParcours.endDate ||
    new Date(minDate) > new Date(maxDate) ||
    new Date(maxDate) < new Date(minDate)
  ) {
    return null;
  }

  const response = await prisma.module.update({
    where: { id: moduleId },
    data: { minDate: minDate, maxDate: maxDate },
  });

  if (!response) {
    return null;
  }

  return response;
}
