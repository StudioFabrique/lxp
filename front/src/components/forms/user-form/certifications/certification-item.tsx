import { FC } from "react";
import Graduation from "../../../../utils/interfaces/graduation";
import DeleteIcon from "../../../UI/svg/delete-icon.compoenent";
import EditIcon from "../../../UI/svg/edit-icon";

const CertificationItem: FC<{
  graduation: Graduation;
  onDelete: (id: number) => void;
}> = ({ graduation, onDelete }) => {
  const handleClickButtonEdit = () => {};

  const handleClickButtonDelete = () => {
    onDelete(graduation.id!);
  };

  return (
    <div className="flex items-center justify-between bg-primary-content rounded-md w-full py-2 px-5 max-h-[80px]">
      <span>
        <p className="text-lg font-bold">{graduation.title}</p>
        <p>{graduation.date.getFullYear()}</p>
      </span>
      <span>
        <button type="button" onClick={handleClickButtonEdit}>
          <EditIcon />
        </button>
        <button type="button" onClick={handleClickButtonDelete}>
          <DeleteIcon />
        </button>
      </span>
    </div>
  );
};

export default CertificationItem;
