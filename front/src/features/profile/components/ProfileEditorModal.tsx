import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle, X } from "lucide-react";
import InformationAndSettings from "./information/information-and-settings";
import { useLocation } from "react-router";

type Props = { onClose: () => void; onSaved: () => void };

export default function ProfileEditorModal({ onClose, onSaved }: Props) {
  const isStudent = useLocation().pathname.startsWith("/student");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Enregistrement en cours : loader sur « Sauvegarder », boutons et fermeture désactivés.
  const [isSaving, setIsSaving] = useState(false);

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
      onCancel={(event) => {
        if (isSaving) event.preventDefault();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
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
            disabled={isSaving}
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="scroll-fade-bottom min-h-0 overflow-y-auto px-6 pb-5">
          <InformationAndSettings
            formRef={formRef}
            onSaved={onSaved}
            onSubmittingChange={setIsSaving}
            isStudent={isStudent}
          />
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-base-300 bg-base-100 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSaving}>
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isSaving}
          >
            {isSaving && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            Sauvegarder
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
