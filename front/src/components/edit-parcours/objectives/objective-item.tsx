import { FC } from "react";
import Objective from "../../../utils/interfaces/objective";
import EditIcon from "../../UI/svg/edit-icon";
import DeleteIcon from "../../UI/svg/delete-icon.compoenent";

type Props = {
  objective: Objective;
  onDelete: (id: number) => void;
};

const ObjectiveItem: FC<Props> = ({ objective, onDelete }) => {
  return (
    <article className="flex gap-x-2 items-center">
      <div className="flex-1 h-12 rounded-lg bg-neutral flex items-center pl-2">
        {objective.description}
      </div>
      <button className="btn btn-primary btn-circle rounded-lg">
        <EditIcon />
      </button>
      <button
        className="btn btn-primary btn-circle rounded-lg"
        onClick={() => onDelete(objective.id!)}
      >
        <DeleteIcon />
      </button>
    </article>
  );
};

export default ObjectiveItem;
