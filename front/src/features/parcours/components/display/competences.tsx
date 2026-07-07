import { useParcoursSelector } from "../../store/ParcoursContext";
import Wrapper from "../../../../../src.legacy/components/UI/wrapper/wrapper.component";

const Competences = () => {
  const skills = useParcoursSelector((state) => state.parcoursSkills.skills);

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
      <div className="flex flex-col gap-y-2 overflow-y-auto h-[60vh]">
        {skillList}
      </div>
    </Wrapper>
  );
};

export default Competences;
