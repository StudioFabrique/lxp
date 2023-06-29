import SkillInput from "./skill-input";
import SkillBadge from "./skill-badge";
import SkillActions from "./skill-actions";
import Skill from "../../utils/interfaces/skill";
import { FC, useState } from "react";

type Props = {
  skill?: Skill;
  onDeleteSkill: (skillId: number) => void;
  onSubmitSkill: (skill: Skill) => void;
};

const SkillItem: FC<Props> = ({ skill, onDeleteSkill, onSubmitSkill }) => {
  const [newSkill, setNewSkill] = useState<Skill | undefined>(skill);

  const handleSumbitSkillTitle = (value: string) => {
    const updatedSkill: Skill = { ...newSkill, title: value };
    setNewSkill(updatedSkill);
    onSubmitSkill(updatedSkill);
  };

  return (
    <div className="flex gap-x-4">
      <SkillInput
        title={skill && skill.title ? skill.title : ""}
        onSubmiSkill={handleSumbitSkillTitle}
      />
      <SkillBadge badge={skill && skill.badge ? skill.badge : undefined} />
      {skill && skill.id ? (
        <SkillActions skillId={skill.id} onDeleteSkill={onDeleteSkill} />
      ) : null}
    </div>
  );
};

export default SkillItem;
