import SkillBadge from "../../../components/skills/skill-badge";
import type Skill from "../../../utils/interfaces/skill";

type SkillBadgeSummaryProps = {
  skills?: Skill[];
  className?: string;
};

const MAX_VISIBLE_BADGES = 2;

const SkillBadgeSummary = ({
  skills = [],
  className = "",
}: SkillBadgeSummaryProps) => {
  if (skills.length === 0) return null;

  const hiddenBadgeCount = Math.max(0, skills.length - MAX_VISIBLE_BADGES);

  return (
    <div
      className={`flex shrink-0 justify-between items-start gap-1 ${className}`}
    >
      {skills.slice(0, MAX_VISIBLE_BADGES).map((skill) => (
        <SkillBadge key={skill.id} skill={skill} size="small" />
      ))}
      {hiddenBadgeCount > 0 ? (
        <span
          className="mx-3 my-auto shrink-0 font-semibold"
          aria-label={`${hiddenBadgeCount} badge${hiddenBadgeCount > 1 ? "s" : ""} supplémentaire${hiddenBadgeCount > 1 ? "s" : ""}`}
        >
          +{hiddenBadgeCount}
        </span>
      ) : null}
    </div>
  );
};

export default SkillBadgeSummary;
