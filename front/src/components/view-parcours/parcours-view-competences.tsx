import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Skill from "../../utils/interfaces/skill";

const ParcoursViewCompetences = () => {
  const skills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];

  const skillList =
    skills.length > 0 ? (
      skills.map((skill, i) => (
        <div key={skill.id} className="bg-secondary p-4 rounded-lg">
          <p className="font-bold">{`Compétence ${i + 1}`}</p>
          <p>{skill.description}</p>
        </div>
      ))
    ) : (
      <p>Aucune compétences</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Compétences</h2>
      <div className="flex flex-col gap-y-5 overflow-y-auto h-[60vh]">
        {skillList}
      </div>
    </Wrapper>
  );
};

export default ParcoursViewCompetences;
