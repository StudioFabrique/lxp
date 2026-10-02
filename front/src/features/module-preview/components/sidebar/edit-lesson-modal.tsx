import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonDetailsSchema } from "../../assignment.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { BookOpen, LoaderCircle, X } from "lucide-react";
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
  const form = useForm({
    resolver: zodResolver(lessonDetailsSchema),
    defaultValues: {
      title: lesson.title,
      description: lesson.description ?? "",
      modalite: lesson.modalite ?? "distanciel",
      tagId: lesson.tag?.id ?? courseTags[0]?.id ?? 0,
    },
  });
  const [title, setTitle] = useFormField(form, "title");
  const [description, setDescription] = useFormField(form, "description");
  const [modalite, setModalite] = useFormField(form, "modalite");
  const [tagId, setTagId] = useFormField(form, "tagId");
  const selectedTagId = tagId || "";
  const firstTagId = courseTags[0]?.id ?? 0;
  const hasSelectedTag = courseTags.some((tag) => tag.id === tagId);
  useEffect(() => {
    if (!hasSelectedTag) setTagId(firstTagId);
  }, [hasSelectedTag, firstTagId, setTagId]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (isSubmitting) return;
    if (!courseTags.some((tag) => tag.id === values.tagId)) {
      form.setError("tagId", { message: "Sélectionnez un tag du cours." });
      showFormErrors(form.formState.errors);
      return;
    }
    if (await onSubmit(values)) onClose();
  }, showFormErrors);

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
                <span className="inline-block first-letter:uppercase">
                  {lesson.title}
                </span>
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
              Ajoutez d'abord un tag au cours pour modifier cette leçon.
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
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
