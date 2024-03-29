import { FC } from "react";

import EditIcon from "../../../UI/svg/edit-icon";
import DeleteIcon from "../../../UI/svg/delete-icon.component";
import Graduation from "../../../../utils/interfaces/graduation";

const CertificationItem: FC<{
  graduation: Graduation;
  onDelete: (id: number) => void;
}> = ({ graduation, onDelete }) => {
  const handleClickButtonEdit = () => {};

  const handleClickButtonDelete = () => {
    onDelete(graduation.id!);
  };

  return (
    <div className="flex items-center justify-between bg-base-100 rounded-md w-full py-2 px-5 max-h-[80px]">
      <span>
        <p className="text-lg font-bold">{graduation.title}</p>
        <p>{graduation.date.getFullYear()}</p>
      </span>
      <span className="flex items-center gap-2">
        <button type="button" onClick={handleClickButtonEdit}>
          <div className="w-6 h-6">
            <EditIcon />
          </div>
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
