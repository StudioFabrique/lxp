import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

import putAccomplishmentCompleted from "../../models/user/accomplishments/put-accomplishment-completed.ts";

export default async function congratulateStudent(
  studentMdbId: string,
  accomplishmentId: number,
) {
  const existingAccomplishment = await prisma.orm.public.Accomplishment.where(
    (row) =>
      whereFromObject(row, {
        id: accomplishmentId,
        student: { idMdb: studentMdbId },
      }),
  ).first();

  if (!existingAccomplishment || existingAccomplishment?.hasBeenCongratulated) {
    return;
  }

  const accomplishment = await putAccomplishmentCompleted(accomplishmentId);

  return accomplishment;
}
