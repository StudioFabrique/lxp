import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getBonusSkillsFromParcours() {
  const skills = await prisma.bonusSkill.findMany();
  return skills;
}

export default getBonusSkillsFromParcours;
