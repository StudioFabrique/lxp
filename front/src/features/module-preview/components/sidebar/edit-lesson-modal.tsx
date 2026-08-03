import { BookOpen, Loader2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { createPortal } from "react-dom";

import type Lesson from "../../../../utils/interfaces/lesson";
import type Tag from "../../../../utils/interfaces/tag";
import type { LessonFormValues } from "./lesson-form.types";

type Props = {
  lesson: Lesson;
  courseTags: Tag[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormValues) => Promise<boolean>;
};

export default function EditLessonModal({
  lesson,
  courseTags,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [modalite, setModalite] = useState(lesson.modalite ?? "distanciel");
  const [tagId, setTagId] = useState<number | "">(
    lesson.tag?.id ?? courseTags[0]?.id ?? "",
  );
  const selectedTagId = courseTags.some((tag) => tag.id === tagId)
    ? tagId
    : (courseTags[0]?.id ?? "");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !selectedTagId) return;

    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      modalite,
      tagId: Number(selectedTagId),
    });
    if (success) onClose();
  };

  return createPortal(
    <dialog
      className="modal modal-open z-[100]"
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
    >
      <div className="modal-box flex max-h-[90vh] w-11/12 max-w-2xl flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <BookOpen className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-lg font-bold">Modifier la leçon</h3>
              <p className="truncate text-sm text-base-content/60">
                {lesson.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          id={`edit-lesson-form-${lesson.id}`}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">
              Titre <span className="text-error">*</span>
            </span>
            <input
              autoFocus
              className="input input-bordered w-full"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">
              Description{" "}
              <span className="font-normal text-base-content/50">
                (optionnelle)
              </span>
            </span>
            <textarea
              className="textarea textarea-bordered min-h-28 w-full resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">
                Tag <span className="text-error">*</span>
              </span>
              <select
                className="select select-bordered w-full"
                value={selectedTagId}
                disabled={courseTags.length === 0}
                onChange={(event) => setTagId(Number(event.target.value))}
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
              <span className="text-sm font-semibold">Modalité</span>
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
              Ajoutez d’abord un tag au cours pour modifier cette leçon.
            </p>
          )}
        </form>

        <div className="flex justify-end gap-3 border-t border-base-300 bg-base-100 px-6 py-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            form={`edit-lesson-form-${lesson.id}`}
            className="btn btn-primary"
            disabled={!title.trim() || !selectedTagId || isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      >
        Fermer
      </button>
    </dialog>,
    document.body,
  );
}
