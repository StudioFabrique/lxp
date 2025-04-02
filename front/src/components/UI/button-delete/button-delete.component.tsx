/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { Trash2Icon } from "lucide-react";
import Modal from "../modal/modal";

const ButtonDelete: FC<{
  userItem: any;
  onDelete: (id: string) => void;
  isLoading: boolean;
  error?: string;
}> = ({ userItem, isLoading, onDelete, error }) => {
  const [isModalActive, setModalState] = useState<boolean>(false);

  const handleShowModal = () => {
    setModalState(true);
  };

  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleConfirmDelete = () => {
    if (isModalActive && !isLoading) {
      onDelete(userItem._id);
    }
  };

  return (
    <>
      {isModalActive && (
        <Modal
          title="Confirmation de suppression"
          isSubmitting={isLoading}
          rightLabel="Supprimer"
          onRightClick={handleConfirmDelete}
          leftLabel="Annuler"
          onLeftClick={handleCloseModal}
        >
          <div className="m-1 flex flex-col gap-2">
            <div className="flex gap-x-1">
              <span>Êtes-vous sûr de vouloir supprimer l'utilisateur</span>
              <span className="bg-transparent capitalize">
                {userItem.firstname}
              </span>
              <span className="bg-transparent capitalize">
                {userItem.lastname} ?
              </span>
            </div>
            <p className="text-warning text-sm pb-2">
              Attention: Cette opération ne peut pas être annulée
            </p>
            <p className="text-error">{error}</p>
          </div>
        </Modal>
      )}
      <button type="button" onClick={handleShowModal}>
        <Trash2Icon className="w-4 h-4 text-error" />
      </button>
    </>
  );
};

export default ButtonDelete;
