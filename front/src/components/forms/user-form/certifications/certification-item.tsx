import { FC } from "react";

import EditIcon from "../../../UI/svg/edit-icon";
import DeleteIcon from "../../../UI/svg/delete-icon.component";
import Graduation from "../../../../utils/interfaces/graduation";

const CertificationItem: FC<{
  graduation: Graduation;
  onDelete: (id: number) => void;
  onSetEditMode: (graduation: Graduation) => void;
}> = ({ graduation, onDelete, onSetEditMode }) => {
  const handleClickButtonEdit = () => {
    onSetEditMode(graduation);
  };

  const handleClickButtonDelete = () => {
    onDelete(graduation.id!);
  };

  return (
    <div className="flex items-center justify-between bg-secondary/20 rounded-md w-full py-2 px-5 max-h-[80px]">
      <span>
        <p className="text-lg font-bold">{graduation.title}</p>
        <p>{graduation.date.getFullYear()}</p>
      </span>
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleClickButtonEdit}
          className="h-6 w-6"
        >
          <EditIcon />
        </button>
        <button
          type="button"
          onClick={handleClickButtonDelete}
          className="h-6 w-6"
        >
          <DeleteIcon />
        </button>
      </span>
    </div>
  );
};

export default CertificationItem;
