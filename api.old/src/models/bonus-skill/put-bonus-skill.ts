import { prisma } from "../../utils/db";

async function putBonusSkill(newSkill: any) {
  console.log({ newSkill });

  const id = parseInt(newSkill.id);
  const response = await prisma.bonusSkill.update({
    where: { id: id },
    data: newSkill,
  });
  return response;
}

export default putBonusSkill;
