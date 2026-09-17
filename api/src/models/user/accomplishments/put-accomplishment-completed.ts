import {
  requireDatabaseRow,
  whereFromObject,
} from "../../../utils/prisma-query.ts";
import { prisma } from "../../../utils/db.ts";

export default async function putAccomplishmentCompleted(
  accomplishmentId: number,
) {
  const accomplishment = await prisma.orm.public.Accomplishment.where((row) =>
    whereFromObject(row, { id: accomplishmentId }),
  )
    .update({ hasBeenCongratulated: true })
    .then(requireDatabaseRow);

  return accomplishment;
}
