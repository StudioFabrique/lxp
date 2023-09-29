import { prisma } from "../../utils/db";

export default async function updateDurationModule(
  id: number,
  duration: number
) {
  const updatedModule = prisma.module.update({
    where: { id: +id },
    data: { duration },
  });

  if (!updatedModule) {
    return null;
  }

  return updatedModule;
}
