export default function courseSkillsFromHttp(data: any) {
  const updatedData = {
    courseSkills: data.bonusSkills.map((item: any) => item.bonusSkill),
    moduleSkills: data.module.bonusSkills.map((item: any) => item.bonusSkill),
  };
  console.log({ updatedData });

  return updatedData;
}
