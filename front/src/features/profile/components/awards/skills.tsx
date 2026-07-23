import { FC } from "react";
import Skill from "../../../../utils/interfaces/skill";

const Skills: FC<{ skillData: Skill[] }> = ({ skillData }) => {
  const RenderSkills = () =>
    skillData.length > 0 ? (
      <div>
        {skillData.map((skill) => (
          <p key={skill.id}>{skill.description}</p>
        ))}
      </div>
    ) : (
      <p>Aucune compétence obtenue</p>
    );

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Compétences</h3>
      <RenderSkills />
    </div>
  );
};

export default Skills;
