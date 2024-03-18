/* eslint-disable @typescript-eslint/no-explicit-any */
export default function courseSkillsFromHttp(data: any) {
  const updatedData = {
    courseSkills: data.bonusSkills.map((item: any) => item.bonusSkill),
    moduleSkills: data.module.bonusSkills.map((item: any) => item.bonusSkill),
  };

  return updatedData;
}
