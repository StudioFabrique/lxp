import SkillInput from "./skill-input.component";
import SkillBadge from "./skill-badge.component";
import SkillActions from "./skill-actions.component";
import Skill from "../../utils/interfaces/skill";
import { FC, useState } from "react";

type Props = {
  skill?: Skill;
  onBadgeSelect: () => void;
  onDeleteSkill: (skillId: number) => void;
  onSubmitSkill: (skill: Skill) => void;
};

const SkillItem: FC<Props> = ({
  skill,
  onBadgeSelect,
  onDeleteSkill,
  onSubmitSkill,
}) => {
  const [newSkill, setNewSkill] = useState<Skill | undefined>(skill);

  const handleSumbitSkillTitle = (value: string) => {
    const updatedSkill: Skill = { ...newSkill, title: value };
    setNewSkill(updatedSkill);
    onSubmitSkill(updatedSkill);
  };

  return (
    <div className="w-full flex gap-x-4">
      <SkillInput
        title={skill && skill.title ? skill.title : ""}
        onSubmiSkill={handleSumbitSkillTitle}
      />
      <SkillBadge
        badge={skill && skill.badge ? skill.badge : undefined}
        onBadgeSelect={onBadgeSelect}
      />
      {skill && skill.id ? (
        <SkillActions skillId={skill.id} onDeleteSkill={onDeleteSkill} />
      ) : null}
    </div>
  );
};

export default SkillItem;
