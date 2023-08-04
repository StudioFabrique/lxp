import { FC } from "react";
import Skill from "../../../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";

const SkillsList: FC<{ skills: Skill[]; onDelete: (id: number) => void }> = ({
  skills,
  onDelete,
}) => {
  return (
    <div className="flex flex-col gap-y-2 mt-5">
      {skills.map((skill) => (
        <SkillItem skill={skill} onDelete={onDelete} key={skill.id} />
      ))}
    </div>
  );
};

export default SkillsList;
