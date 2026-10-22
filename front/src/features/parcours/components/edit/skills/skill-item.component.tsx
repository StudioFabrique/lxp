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

// Même carte que les objectifs : badge et titre partagent la hauteur de la ligne.
const SkillItem: FC<Props> = ({ skill, onUpdateSkill, onDeleteSkill }) => {
  return (
    <div className="flex w-full items-stretch gap-x-3 rounded-lg border border-base-300 bg-base-100 p-2 shadow-sm transition-colors hover:border-primary/40">
      <SkillBadge badge={skill.badge} />
      <SkillTitle title={skill.description} />
      <SkillActions
        skill={skill}
        onUpdateSkill={onUpdateSkill}
        onDeleteSkill={onDeleteSkill}
      />
    </div>
  );
};

export default SkillItem;

// TODO: inclure l'image par défaut
