import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import TrophyIcon from "../../../../../src/components/UI/svg/trophy-icon.component";
import { useParams } from "react-router";
import { useParcoursSkills } from "../../hooks/useParcoursSkills";
import { useContext } from "react";
import { AuthContext } from "../../../../store/AuthProvider";
import { getUserArea } from "../../../../utils/helpers/user-role";

const Competences = () => {
  const { id } = useParams();
  const { skills } = useParcoursSkills(Number(id));
  const { user } = useContext(AuthContext);
  const isStudent = getUserArea(user) === "student";

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
                  className={`size-full object-contain transition-opacity ${isStudent && !skill.isEarned ? "opacity-30" : "opacity-100"}`}
                  src={skill.badge}
                  alt={skill.description}
                  title={isStudent ? (skill.isEarned ? "Badge obtenu" : "Badge à obtenir") : undefined}
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
