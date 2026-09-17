import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function deleteBonusSkill(id: number) {
  const existingSkill = await prisma.orm.public.BonusSkill.where({
    id,
  }).first();

  if (!existingSkill) {
    const error404 = {
      message: "La compétence n'existe pas.",
      statusCode: 404,
    };
    throw error404;
  }

  try {
    const response = await prisma.orm.public.BonusSkill.where({ id })
      .delete()
      .then(requireDatabaseRow);
  } catch (error: any) {
    const error405 = {
      message:
        "La compétence n'a pas pu être effacée, vérifiez qu'elle ne soit pas rattachée à un module.",
      statusCode: 405,
    };
    throw error405;
  }
}

export default deleteBonusSkill;
