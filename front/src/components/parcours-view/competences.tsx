/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Skill from "../../utils/interfaces/skill";

const Competences = () => {
  const skills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];

  const skillList =
    skills.length > 0 ? (
      skills.map((skill) => (
        <div
          key={skill.id}
          className="bg-secondary p-4 rounded-lg text-base-content"
        >
          <p className="first-letter:uppercase">{skill.description}</p>
        </div>
      ))
    ) : (
      <p>Aucune compétences</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Compétences</h2>
      <div className="flex flex-col gap-y-2 overflow-y-auto h-[60vh]">
        {skillList}
      </div>
    </Wrapper>
  );
};

export default Competences;
