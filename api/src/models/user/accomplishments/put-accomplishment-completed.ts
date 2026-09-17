import { requireDatabaseRow } from "../../../utils/require-database-row.ts";
import { prisma } from "../../../utils/db.ts";

export default async function putAccomplishmentCompleted(
  accomplishmentId: number,
) {
  const accomplishment = await prisma.orm.public.Accomplishment.where({
    id: accomplishmentId,
  })
    .update({ hasBeenCongratulated: true })
    .then(requireDatabaseRow);

  return accomplishment;
}
