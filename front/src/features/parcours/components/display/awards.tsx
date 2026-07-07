import { useParcoursSelector } from "../../store/ParcoursContext";
import Wrapper from "../../../../../src.legacy/components/UI/wrapper/wrapper.component";

const Awards = () => {
  const skills = useParcoursSelector((state) => state.parcoursSkills.skills);

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
      <h2 className="text-xl font-bold text-primary">Badges</h2>
      <div className="flex gap-4 flex-wrap overflow-y-auto">{skillList}</div>
    </Wrapper>
  );
};

export default Awards;
