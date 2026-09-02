import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { useParams } from "react-router";
import { useParcoursSkills } from "../../hooks/useParcoursSkills";

const Competences = () => {
  const { id } = useParams();
  const { skills } = useParcoursSkills(Number(id));

  const skillList =
    skills.length > 0 ? (
      skills.map((skill) => (
        <div
          key={skill.id}
          className="bg-base-200 border border-base-300 p-4 rounded-lg text-base-content shadow-sm"
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
      <div className="flex flex-col gap-y-2 overflow-y-auto h-[25vh]">
        {skillList}
      </div>
    </Wrapper>
  );
};

export default Competences;
