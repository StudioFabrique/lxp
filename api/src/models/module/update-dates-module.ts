import { prisma } from "../../utils/db";

export default async function updateDatesModule(
  moduleId: number,
  minDate: string,
  maxDate: string
) {
  const response = await prisma.module.update({
    where: { id: moduleId },
    data: { minDate: minDate, maxDate: maxDate },
  });

  if (!response) {
    return null;
  }

  return response;
}
