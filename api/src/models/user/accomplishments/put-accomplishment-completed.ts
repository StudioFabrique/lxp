import { prisma } from "../../../utils/db";

export default async function putAccomplishmentCompleted(
  accomplishmentId: number
) {
  const accomplishment = await prisma.accomplishment.update({
    where: { id: accomplishmentId },
    data: { hasBeenCongratulated: true },
  });

  return accomplishment;
}
