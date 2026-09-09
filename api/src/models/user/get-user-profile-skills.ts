import {
  skillAchievementSelect,
  withSkillAchievement,
} from "../../helpers/skill-achievement.ts";
import { prisma } from "../../utils/db.ts";
import { getAccessibleParcoursIds } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getUserProfileSkills(studentMdbId: string) {
  const parcoursIds = await getAccessibleParcoursIds(studentMdbId);

  if (parcoursIds.length === 0) return [];

  const skills = await prisma.bonusSkill.findMany({
    where: { parcoursId: { in: parcoursIds } },
    orderBy: { createdAt: "asc" },
    select: skillAchievementSelect(studentMdbId),
  });

  return skills.map(withSkillAchievement);
}
