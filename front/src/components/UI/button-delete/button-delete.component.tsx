/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import DeleteModal from "../modal/delete-modal";
import { Trash2Icon } from "lucide-react";

const ButtonDelete: FC<{
  userItem: any;
  onDelete: (id: string) => void;
  isLoading: boolean;
  error?: string;
}> = ({ userItem, isLoading, onDelete, error }) => {
  const [isModalActive, setModalState] = useState<boolean>(false);

  const handleModal = () => {
    setModalState(!isModalActive);
  };

  const handleConfirmDelete = () => {
    if (isModalActive && !isLoading) {
      onDelete(userItem._id);
    }
  };

  return (
    <>
      {isModalActive && (
        <DeleteModal
          isLoading={isLoading}
          onConfirm={handleConfirmDelete}
          onCancel={handleModal}
          error={error}
        />
      )}
      <button type="button" onClick={() => {}}>
        <Trash2Icon className="w-4 h-4 text-error" />
      </button>
    </>
  );
};

export default ButtonDelete;
