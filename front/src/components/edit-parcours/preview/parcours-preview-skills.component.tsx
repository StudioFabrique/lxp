import { useSelector } from "react-redux";

import Skill from "../../../utils/interfaces/skill";
import Wrapper from "../../UI/wrapper/wrapper.component";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";

const ParcoursPreviewSkills = () => {
  const skills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];
  return (
    <Wrapper>
      <h2 className="text-xl font-bold">Compétences du parcours</h2>
      <ul className="flex flex-col gap-y-2">
        {skills.map((skill) => (
          <li className="w-full flex gap-x-2 items-center" key={skill.id}>
            <SubWrapper>
              <div className="w-6 h-6">
                <img
                  className="w-full h-full"
                  src={skill.badge}
                  alt={skill.description}
                />
              </div>
            </SubWrapper>
            <div className="flex-1">
              <SubWrapper>
                <p>{skill.description}</p>
              </SubWrapper>
            </div>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default ParcoursPreviewSkills;
