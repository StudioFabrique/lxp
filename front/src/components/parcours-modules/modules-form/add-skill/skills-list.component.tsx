import { FC, useEffect } from "react";
import Skill from "../../../../utils/interfaces/skill";

const SkillsList: FC<{ skills: Skill[] }> = ({ skills }) => {
  return (
    <div className="flex flex-col gap-y-2 mt-5">
      {skills.map((skill) => (
        <p className="bg-secondary-content p-2 rounded-lg" key={skill.id}>
          {skill.description}
        </p>
      ))}
    </div>
  );
};

export default SkillsList;
