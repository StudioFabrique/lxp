import { prisma } from "../../utils/db.ts";

async function getBonusSkillsFromParcours() {
  const skills = await prisma.orm.public.BonusSkill.all();
  return skills;
}

export default getBonusSkillsFromParcours;
