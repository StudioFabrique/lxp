import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Skill from "../../utils/interfaces/skill";

const ParcoursViewAwards = () => {
  const skills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];

  const skillList =
    skills.length > 0 ? (
      skills.map((skill) => (
        <div key={skill.id}>
          <img src={skill.badge} alt="" />
        </div>
      ))
    ) : (
      <p>Aucune compétences</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-secondary">Awards</h2>
      <div className="flex gap-4 flex-wrap overflow-y-auto">{skillList}</div>
    </Wrapper>
  );
};

export default ParcoursViewAwards;
