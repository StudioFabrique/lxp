import { prisma } from "../../utils/db";

async function getBonusSkillsFromParcours() {
  const skills = await prisma.bonusSkill.findMany();
  return skills;
}

export default getBonusSkillsFromParcours;
