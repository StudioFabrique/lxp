import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import InformationAndSettings from "./information/information-and-settings";

type Props = { onClose: () => void; onSaved: () => void };

export default function ProfileEditorModal({ onClose, onSaved }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="modal text-base-content"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="profile-editor-title"
    >
      <div className="modal-box flex max-h-[90vh] w-11/12 max-w-4xl flex-col overflow-hidden p-0 text-base-content">
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 pb-4 pt-6">
          <div>
            <h2 id="profile-editor-title" className="text-xl font-bold">
              Modifier mon profil
            </h2>
            <p className="text-sm text-base-content/60">
              Informations personnelles et coordonnées
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-6 pb-5">
          <InformationAndSettings formRef={formRef} onSaved={onSaved} />
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-base-300 bg-base-100 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => formRef.current?.requestSubmit()}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
