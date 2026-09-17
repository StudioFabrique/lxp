import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function putBonusSkill(newSkill: any) {
  const id = parseInt(newSkill.id);
  const response = await prisma.orm.public.BonusSkill.where({ id: id })
    .update(newSkill)
    .then(requireDatabaseRow);
  return response;
}

export default putBonusSkill;
