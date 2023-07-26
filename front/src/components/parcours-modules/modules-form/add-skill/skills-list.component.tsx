import { FC } from "react";
import User from "../../../../utils/interfaces/user";
import Skill from "../../../../utils/interfaces/skill";

const SkillsList: FC<{ skills: Skill[] }> = ({ skills }) => {
  return (
    <div className="flex flex-col gap-y-2">
      {skills.map((skill) => (
        <p className="bg-secondary-content p-2" key={skill.id}>
          {skill.description}
        </p>
      ))}
    </div>
  );
};

export default SkillsList;
