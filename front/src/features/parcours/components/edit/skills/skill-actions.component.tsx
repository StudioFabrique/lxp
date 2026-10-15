import { FC } from "react";

import Skill from "../../../../../../src/utils/interfaces/skill";
import DeleteIcon from "../../../../../../src/components/UI/svg/delete-icon.component";
import EditIcon from "../../../../../../src/components/UI/svg/edit-icon";

type Props = {
  skill: Skill;
  onUpdateSkill: (id: number) => void;
  onDeleteSkill: (id: number) => void;
};

const SkillActions: FC<Props> = ({ skill, onUpdateSkill, onDeleteSkill }) => {
  return (
    <>
      {skill.isBonus ? (
        <div className="flex h-full flex-col items-center justify-center gap-2">
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
