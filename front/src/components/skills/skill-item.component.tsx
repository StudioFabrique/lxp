import { FC } from "react";

import Skill from "../../utils/interfaces/skill";
import SkillTitle from "./skill-title.component";
import SkillBadge from "./skill-badge";
import SkillActions from "./skill-actions.component";

type Props = {
  skill: Skill;
  onUpdateSkill: (id: number) => void;
  onUpdateBadge: (index: number) => void;
};

const SkillItem: FC<Props> = ({ skill, onUpdateSkill, onUpdateBadge }) => {
  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-center gap-x-8">
        <div className="flex-1">
          <SkillTitle title={skill.title} />
        </div>
        <div className="flex gap-x-8 items-center">
          <SkillBadge
            badge={
              skill.badge
                ? skill.badge!
                : { id: 0, title: "Aucun badge choisi", image: "default" }
            }
          />
          <SkillActions
            skillId={skill.id!}
            onUpdateSkill={onUpdateSkill}
            onUpdateBadge={onUpdateBadge}
          />
        </div>
      </div>
    </>
  );
};

export default SkillItem;

// TODO: inclure l'image par défaut
