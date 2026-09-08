import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import TrophyIcon from "../../../../../src/components/UI/svg/trophy-icon.component";
import { useParams } from "react-router";
import { useParcoursSkills } from "../../hooks/useParcoursSkills";

const Competences = () => {
  const { id } = useParams();
  const { skills } = useParcoursSkills(Number(id));

  const skillList =
    skills.length > 0 ? (
      <ul className="flex flex-col gap-y-2">
        {skills.map((skill) => (
          <li
            key={skill.id}
            className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-200 p-4 text-base-content shadow-sm"
          >
            <span className="size-8 shrink-0 text-primary">
              {skill.badge ? (
                <img
                  className="size-full object-contain"
                  src={skill.badge}
                  alt={skill.description}
                />
              ) : (
                <TrophyIcon />
              )}
            </span>
            <p className="first-letter:uppercase">{skill.description}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p>Aucune compétence</p>
    );

  return (
    <Wrapper additionalClassname="h-auto">
      <h2 className="text-xl font-bold text-primary">Badge & Compétences</h2>
      <div className="flex flex-col gap-y-2 overflow-y-auto max-h-60">
        {skillList}
      </div>
    </Wrapper>
  );
};

export default Competences;
