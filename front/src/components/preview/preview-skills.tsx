import Skill from "../../utils/interfaces/skill";
import TrophyIcon from "../UI/svg/trophy-icon.component";
import EditIcon from "../UI/svg/edit-icon";
import BoxWrapper from "../wrappers/BoxWrapper";
import SubBoxWrapper from "../wrappers/SubBoxWrapper";

interface PreviewSkillsProps {
  skills: Skill[];
  onEdit: (id: number) => void;
}

const PreviewSkills = (props: PreviewSkillsProps) => {
  const { skills } = props;

  return (
    <BoxWrapper>
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">Compétences du parcours</h2>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square text-primary"
          onClick={() => props.onEdit(3)}
          aria-label="Modifier les compétences du parcours"
        >
          <span className="size-5">
            <EditIcon />
          </span>
        </button>
      </span>
      <ul className="flex flex-col gap-y-2">
        {skills.map((skill) => (
          <li className="w-full flex gap-x-2 items-center" key={skill.id}>
            <SubBoxWrapper>
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
            </SubBoxWrapper>
            <div className="flex-1">
              <SubBoxWrapper>
                <p>{skill.description}</p>
              </SubBoxWrapper>
            </div>
          </li>
        ))}
      </ul>
    </BoxWrapper>
  );
};

export default PreviewSkills;
