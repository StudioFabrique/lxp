import { FC, KeyboardEvent, KeyboardEventHandler, useEffect } from "react";
import Portal from "../portal/portal";
import DeleteIcon from "../svg/delete-icon.compoenent";

const DeleteModal: FC<{
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  error?: string;
}> = ({ isLoading, onCancel, onConfirm, error }) => {
  useEffect(() => {
    document.body.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && onCancel()
    );
  });

  return (
    <>
      <Portal>
        <div className="relative left-0 top-0 w-screen h-screen bg-black/20 z-20">
          <div className="absolute modal-open z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[30rem]">
            <div className="modal-box px-8 w-full">
              <button
                onClick={onCancel}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <div className="flex gap-x-2">
                <DeleteIcon />
                <h3 className="font-bold pb-4 text-primary">
                  Confirmation de suppression
                </h3>
              </div>
              <p className="py-2">
                Êtes-vous sûr de supprimer cet utilisateur ?
              </p>
              <p className=" text-red-700 text-sm pb-2">
                Attention: Cette opération ne peut pas être annulée
              </p>
              <div className="modal-action flex justify-between">
                <button
                  className="btn btn-outline btn-primary btn-md"
                  onClick={onCancel}
                >
                  Annuler
                </button>
                <button
                  className={`btn btn-primary btn-md ${isLoading && "loading"}`}
                  onClick={onConfirm}
                >
                  Supprimer
                </button>
              </div>
              {error && <p>{error}</p>}
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
};

export default DeleteModal;
