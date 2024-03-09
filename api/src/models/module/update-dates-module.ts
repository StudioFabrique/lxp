import { prisma } from "../../utils/db";

export default async function updateDatesModule(
  moduleId: number,
  minDate: string,
  maxDate: string
) {
  const datesParcours = (
    await prisma.module.findUnique({
      where: { id: +moduleId },
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
  const minDateTime = new Date(minDate);
  const maxDateTime = new Date(maxDate);

  /* if (
    minDateTime < datesParcours.startDate ||
    maxDateTime > datesParcours.endDate ||
    minDateTime > maxDateTime ||
    maxDateTime < minDateTime
  ) {
    return null;
  } */

  const response = await prisma.module.update({
    where: { id: +moduleId },
    data: { minDate: minDateTime, maxDate: maxDateTime },
  });

  if (!response) {
    return null;
  }

  return response;
}
