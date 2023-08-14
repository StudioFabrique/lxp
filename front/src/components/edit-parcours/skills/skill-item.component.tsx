import { FC } from "react";

import SkillTitle from "./skill-title.component";
import SkillBadge from "./skill-badge";
import SkillActions from "./skill-actions.component";
import Skill from "../../../utils/interfaces/skill";

type Props = {
  skill: Skill;
  onUpdateSkill: (id: number) => void;
  onDeleteSkill: (id: number) => void;
};

const SkillItem: FC<Props> = ({ skill, onUpdateSkill, onDeleteSkill }) => {
  return (
    <>
      <div className="w-full h-full flex items-center gap-x-2 gap-y-2">
        <SkillBadge badge={skill.badge} />
        <SkillTitle title={skill.description} />

        <div className="h-full flex gap-x-8 items-center">
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
