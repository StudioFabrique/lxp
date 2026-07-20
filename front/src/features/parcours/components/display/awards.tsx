import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { useParams } from "react-router";
import { useParcoursSkills } from "../../hooks/useParcoursSkills";

const Awards = () => {
  const { id } = useParams();
  const { skills } = useParcoursSkills(Number(id));

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
