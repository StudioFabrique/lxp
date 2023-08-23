import { FC } from "react";

import Objective from "../../../utils/interfaces/objective";
import EditIcon from "../../UI/svg/edit-icon";
import DeleteIcon from "../../UI/svg/delete-icon.compoenent";
import ArrowsIcon from "../../UI/svg/arrows-icon.component";

type Props = {
  objective: Objective;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
};

const ObjectiveItem: FC<Props> = ({ objective, onDelete, onUpdate }) => {
  const handleUpdate = () => {
    onUpdate(objective.id!);
  };

  return (
    <article className="flex gap-x-2 items-center">
      <div className="flex-1 h-12 rounded-lg bg-neutral flex items-center pl-2">
        <span className="flex gap-x-2 items-center">
          <div className="h-4 w-4">
            <ArrowsIcon />
          </div>
          <p>{objective.description}</p>
        </span>
      </div>
      <button
        className="btn btn-primary btn-circle rounded-lg"
        type="button"
        onClick={handleUpdate}
        aria-label="modification de l'objectif"
      >
        <EditIcon />
      </button>
      <button
        className="btn btn-primary btn-circle rounded-lg"
        onClick={() => onDelete(objective.id!)}
        aria-label="suppression de l'objectif"
      >
        <DeleteIcon />
      </button>
    </article>
  );
};

export default ObjectiveItem;
