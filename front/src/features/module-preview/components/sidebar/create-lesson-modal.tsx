import { BookOpen, Loader2, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import type Tag from "../../../../utils/interfaces/tag";

type Props = {
  open: boolean;
  courseTitle: string;
  courseTags: Tag[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    modalite: string;
    tagId: number;
  }) => Promise<boolean>;
};

export default function CreateLessonModal({
  open,
  courseTitle,
  courseTags,
  isSaving,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalite, setModalite] = useState("distanciel");
  const [tagId, setTagId] = useState<number | "">(courseTags[0]?.id ?? "");
  const selectedTagId = courseTags.some((tag) => tag.id === tagId)
    ? tagId
    : (courseTags[0]?.id ?? "");

  const close = () => {
    if (isSaving) return;
    setTitle("");
    setDescription("");
    setModalite("distanciel");
    setTagId(courseTags[0]?.id ?? "");
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <dialog
      className="modal modal-open z-[100]"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <form
        className="modal-box max-w-xl"
        data-onboarding="lesson-details"
        onSubmit={async (event) => {
          event.preventDefault();
          if (title.trim() && selectedTagId) {
            const success = await onSubmit({
              title: title.trim(),
              description: description.trim(),
              modalite,
              tagId: +selectedTagId,
            });
            if (success) {
              setTitle("");
              setDescription("");
              setModalite("distanciel");
              setTagId(courseTags[0]?.id ?? "");
            }
          }
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
          <h3 className="font-bold text-lg">
            Ajouter une leçon dans le cours « {courseTitle} »
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-circle"
            onClick={close}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-5 py-5">
          <label className="flex flex-col gap-2">
            <span
              className="font-semibold"
              data-onboarding-label="lesson-title"
            >
              Titre <span className="text-error">*</span>
            </span>
            <input
              data-onboarding-field="lesson-title"
              autoFocus
              className="input input-bordered w-full"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex. Introduction aux composants React"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-semibold">
              Description{" "}
              <span className="font-normal text-base-content/50">
                (optionnelle)
              </span>
            </span>
            <textarea
              className="textarea textarea-bordered min-h-24 w-full"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ce que l'apprenant découvrira dans cette leçon"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span
                className="font-semibold"
                data-onboarding-label="lesson-tag"
              >
                Tag <span className="text-error">*</span>
              </span>
              <select
                data-onboarding-field="lesson-tag"
                className="select select-bordered w-full"
                value={selectedTagId}
                disabled={courseTags.length === 0}
                onChange={(event) => setTagId(+event.target.value)}
              >
                {courseTags.length === 0 && (
                  <option value="">Aucun tag associé au cours</option>
                )}
                {courseTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-semibold">Modalité</span>
              <select
                className="select select-bordered w-full"
                value={modalite}
                onChange={(event) => setModalite(event.target.value)}
              >
                <option value="distanciel">Distanciel</option>
                <option value="presentiel">Présentiel</option>
                <option value="hybride">Hybride</option>
              </select>
            </label>
          </div>
          {courseTags.length === 0 && (
            <p className="text-sm text-error">
              Ajoutez d’abord un tag au cours pour pouvoir créer une leçon.
            </p>
          )}
        </div>

        <div className="modal-action border-t border-base-300 pt-4">
          <button type="button" className="btn btn-ghost" onClick={close}>
            Annuler
          </button>
          <button
            className="btn btn-primary"
            disabled={!title.trim() || !selectedTagId || isSaving}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Création…" : "Créer la leçon"}
          </button>
        </div>
      </form>
      <button type="button" className="modal-backdrop" onClick={close}>
        Fermer
      </button>
    </dialog>,
    document.body,
  );
}
