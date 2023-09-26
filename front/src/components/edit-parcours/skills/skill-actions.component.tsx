import { FC } from "react";

import Skill from "../../../utils/interfaces/skill";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import EditIcon from "../../UI/svg/edit-icon";

type Props = {
  skill: Skill;
  onUpdateSkill: (id: number) => void;
  onDeleteSkill: (id: number) => void;
};

const SkillActions: FC<Props> = ({ skill, onUpdateSkill, onDeleteSkill }) => {
  return (
    <>
      {skill.isBonus ? (
        <div className="h-full flex flex-col justify-between items-center gap-y-1">
          <button
            className="btn btn-sm btn-circle rounded-md btn-primary"
            onClick={() => onUpdateSkill(skill.id!)}
          >
            <div className="w-4 h-4">
              <EditIcon />
            </div>
          </button>

          <button
            className="btn btn-sm btn-circle rounded-md btn-primary"
            onClick={() => onDeleteSkill(skill.id!)}
          >
            <div className="h-4 w-4">
              <DeleteIcon />
            </div>
          </button>
        </div>
      ) : null}
    </>
  );
};

export default SkillActions;
