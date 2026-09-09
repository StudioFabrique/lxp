import { FC } from "react";
import SkillBadge from "../../../../components/skills/skill-badge";
import type Skill from "../../../../utils/interfaces/skill";

const Skills: FC<{ skillData: Skill[] }> = ({ skillData }) => {
  const skillList =
    skillData.length > 0 ? (
      <ul
        aria-label="Badges de compétences"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        {skillData.map((skill) => (
          <li key={skill.id}>
            <SkillBadge skill={skill} size="small" card />
          </li>
        ))}
      </ul>
    ) : (
      <p className="rounded-lg bg-base-200 p-4 text-base-content/70">
        Aucun badge de compétence pour le moment.
      </p>
    );

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">Mes badges de compétences</h3>
      {skillList}
    </div>
  );
};

export default Skills;
