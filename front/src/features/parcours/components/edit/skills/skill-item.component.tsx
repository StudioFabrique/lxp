import { FC } from "react";

import SkillTitle from "./skill-title.component";
import SkillBadge from "./skill-badge";
import SkillActions from "./skill-actions.component";
import Skill from "../../../../../../src/utils/interfaces/skill";

type Props = {
  skill: Skill;
  onUpdateSkill: (id: number) => void;
  onDeleteSkill: (id: number) => void;
};

const SkillItem: FC<Props> = ({ skill, onUpdateSkill, onDeleteSkill }) => {
  return (
    <>
      <div className="flex h-full w-full items-stretch gap-x-2">
        <SkillBadge badge={skill.badge} />
        <SkillTitle title={skill.description} />

        <div className="flex h-full shrink-0 items-center gap-x-8">
          <SkillActions
            skill={skill}
            onUpdateSkill={onUpdateSkill}
            onDeleteSkill={onDeleteSkill}
          />
        </div>
      </div>
    </>
  );
};

export default SkillItem;

// TODO: inclure l'image par défaut
