import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
