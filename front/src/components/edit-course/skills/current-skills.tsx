import Skill from "../../../utils/interfaces/skill";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import TrophyIcon from "../../UI/svg/trophy-icon.component";

interface CurrentSkillsProps {
  list?: Skill[];
  onRemoveItem?: (value: any) => void;
}

const CurrentSkills = (props: CurrentSkillsProps) => {
  return (
    <>
      {props.list && props.list.length > 0 ? (
        <>
          <p>Ajouter les compétences courvertes par le cours</p>
          <ul className="flex flex-col gap-y-2">
            {props.list.map((skill: Skill) => (
              <li className="<-full flex gap-x-2 items-center" key={skill.id!}>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 hover:bg-secondary/20 hover:cursor-default border-none no-animation flex items-center justify-center">
                  {skill.badge ? (
                    <img
                      className="w-full h-full p-2"
                      src={skill.badge}
                      alt={skill.description}
                    />
                  ) : (
                    <div className="w-6 h-6 text-primary">
                      <TrophyIcon />
                    </div>
                  )}
                </div>
                <div className="flex-1 h-12 rounded-lg bg-secondary/10 flex items-center p-2">
                  <p>{skill.description}</p>
                </div>
                <button
                  className="btn btn-circle rounded-md btn-primary"
                  onClick={() => props.onRemoveItem!(skill)}
                >
                  <div className="h-6 w-6">
                    <DeleteIcon />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <SubWrapper>
          <p className="text-xs">Aucune compétence sélectionnée</p>
        </SubWrapper>
      )}
    </>
  );
};

export default CurrentSkills;
