import Skill from "../../utils/interfaces/skill";
import Wrapper from "../UI/wrapper/wrapper.component";
import SubWrapper from "../UI/sub-wrapper/sub-wrapper.component";
import TrophyIcon from "../UI/svg/trophy-icon.component";
import EditIcon from "../UI/svg/edit-icon";

interface PreviewSkillsProps {
  skills: Skill[];
  onEdit: (id: number) => void;
}

const PreviewSkills = (props: PreviewSkillsProps) => {
  const { skills } = props;

  return (
    <Wrapper>
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">Compétences du parcours</h2>
        <div className="w-6 h-6 text-primary" onClick={() => props.onEdit(3)}>
          <EditIcon />
        </div>
      </span>
      <ul className="flex flex-col gap-y-2">
        {skills.map((skill) => (
          <li className="w-full flex gap-x-2 items-center" key={skill.id}>
            <SubWrapper>
              <div className="w-6 h-6 text-primary cursor-pointer">
                {skill.badge ? (
                  <img
                    className="w-full h-full"
                    src={skill.badge}
                    alt={skill.description}
                  />
                ) : (
                  <TrophyIcon />
                )}
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

export default PreviewSkills;
