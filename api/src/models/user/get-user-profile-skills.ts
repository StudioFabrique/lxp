import { loadSkillAchievements } from "../../helpers/skill-achievement-query.ts";
import { getAccessibleParcoursIds } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getUserProfileSkills(studentMdbId: string) {
  const parcoursIds = await getAccessibleParcoursIds(studentMdbId);

  if (parcoursIds.length === 0) return [];

  const skills = await loadSkillAchievements(studentMdbId, { parcoursIds });
  return [...skills.values()];
}
