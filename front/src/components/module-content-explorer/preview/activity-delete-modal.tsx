import { useRef, useEffect } from "react";

type Props = {
  textActivityTitle: string;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  isOpen: boolean;
};

const ActivityDeleteModal = ({
  textActivityTitle,
  onCloseDeleteModal,
  onConfirmDelete,
  isOpen,
}: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="modal" onClose={onCloseDeleteModal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Supprimer l'activité</h3>
        <p className="py-4">
          Êtes-vous sûr de vouloir supprimer l'activité "{textActivityTitle}" ?
          Cette action est irréversible.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCloseDeleteModal}>
            Annuler
          </button>
          <button
            className="btn btn-error text-base-100"
            onClick={onConfirmDelete}
          >
            Supprimer
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ActivityDeleteModal;
