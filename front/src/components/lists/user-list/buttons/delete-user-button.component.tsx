import { FC, useState } from "react";
import Can from "../../../UI/can/can.component";
import DeleteModal from "../../../UI/modal/delete-modal";

const DeleteUserButton: FC<{
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
    <Can action="delete" subject={userItem.roles[0].role}>
      {isModalActive && (
        <DeleteModal
          isLoading={isLoading}
          onConfirm={handleConfirmDelete}
          onCancel={handleModal}
          error={error}
        />
      )}
      <button type="button" onClick={handleModal}>
        Supprimer
      </button>
    </Can>
  );
};

export default DeleteUserButton;
