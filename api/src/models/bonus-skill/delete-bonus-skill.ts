import { prisma } from "../../utils/db";

async function deleteBonusSkill(id: number) {
  try {
    const response = await prisma.bonusSkill.delete({
      where: { id },
    });
    return response;
  } catch (error: any) {
    return error;
  }
}

export default deleteBonusSkill;
