import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import SkillBadge from "../../../../components/skills/skill-badge";
import { useParams } from "react-router";
import { useParcoursSkills } from "../../hooks/useParcoursSkills";

const Competences = () => {
  const { id } = useParams();
  const { skills } = useParcoursSkills(Number(id));

  const skillList =
    skills.length > 0 ? (
      <ul className="flex flex-col gap-y-2">
        {skills.map((skill) => (
          <li key={skill.id}>
            <SkillBadge skill={skill} size="small" card />
          </li>
        ))}
      </ul>
    ) : (
      <p>Aucune compétence</p>
    );

  return (
    <BoxWrapper className="h-auto">
      <h2 className="text-xl font-bold text-primary">Badge & Compétences</h2>
      <div className="flex flex-col gap-y-2 overflow-y-auto max-h-60">
        {skillList}
      </div>
    </BoxWrapper>
  );
};

export default Competences;
