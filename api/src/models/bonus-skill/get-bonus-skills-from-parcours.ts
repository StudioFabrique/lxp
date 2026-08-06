import { prisma } from "../../utils/db.ts";

async function getBonusSkillsFromParcours() {
  const skills = await prisma.bonusSkill.findMany();
  return skills;
}

export default getBonusSkillsFromParcours;
