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
        <div className="flex shrink-0 flex-col items-center justify-center gap-1 md:flex-row">
          <button
            className="btn btn-ghost btn-square btn-sm text-primary"
            type="button"
            onClick={() => onUpdateSkill(skill.id!)}
            aria-label="modification de la compétence"
          >
            <div className="size-5">
              <EditIcon />
            </div>
          </button>

          <button
            className="btn btn-ghost btn-square btn-sm text-error"
            type="button"
            onClick={() => onDeleteSkill(skill.id!)}
            aria-label="suppression de la compétence"
          >
            <div className="size-5">
              <DeleteIcon />
            </div>
          </button>
        </div>
      ) : null}
    </>
  );
};

export default SkillActions;
