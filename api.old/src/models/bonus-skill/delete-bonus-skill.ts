import { prisma } from "../../utils/db";

async function deleteBonusSkill(id: number) {
  const existingSkill = await prisma.bonusSkill.findFirst({
    where: { id },
  });

  if (!existingSkill) {
    const error404 = {
      message: "La compétence n'existe pas.",
      statusCode: 404,
    };
    throw error404;
  }

  try {
    const response = await prisma.bonusSkill.delete({
      where: { id },
    });
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
