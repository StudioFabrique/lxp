import type Skill from "../../../../utils/interfaces/skill";
import SkillBadge from "../../../../components/skills/skill-badge";

export default function ModuleBadges({ skills }: { skills: Skill[] }) {
  const badges = skills;
  if (!badges.length) return null;

  return (
    <ul aria-label="Badges du module" className="flex flex-wrap gap-5 py-3">
      {badges.map((skill) => (
        <li key={skill.id}>
          <SkillBadge skill={skill} />
        </li>
      ))}
    </ul>
  );
}
