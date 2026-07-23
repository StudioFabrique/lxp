import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { createPortal } from "react-dom";

import apiClient from "../../../../lib/axios";
import type Course from "../../../../utils/interfaces/course";
import type Tag from "../../../../utils/interfaces/tag";
import type { UpdateCourseFormValues } from "./course-form.types";

type Props = {
  course: Course;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateCourseFormValues) => Promise<boolean>;
};

export default function EditCourseModal({
  course,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description ?? "");
  const [visibility, setVisibility] = useState(course.visibility ?? true);
  const [selectedTagIds, setSelectedTagIds] = useState(
    (course.tags ?? []).map((tag) => tag.id),
  );

  const { data: tags = [] } = useQuery({
    queryKey: ["tags", "course-edit"],
    queryFn: async (): Promise<Tag[]> => {
      const response = await apiClient.get("/tag");
      return response.data;
    },
  });

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      visibility,
      tagIds: selectedTagIds,
    });
    if (success) onClose();
  };

  return createPortal(
    <dialog className="modal modal-open z-[100]">
      <div className="modal-box flex max-h-[90vh] w-11/12 max-w-2xl flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold">Modifier le cours</h3>
            <p className="text-sm text-base-content/60">{course.title}</p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          id={`edit-course-form-${course.id}`}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Titre *</span>
            <input
              autoFocus
              className="input input-bordered w-full"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              className="textarea textarea-bordered min-h-28 w-full resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-3 border-y border-base-300 py-4">
            <span>
              <span className="block text-sm font-semibold">
                Visible par les apprenants
              </span>
              <span className="text-xs text-base-content/60">
                Contrôle l’accès au cours une fois celui-ci publié.
              </span>
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={visibility}
              onChange={(event) => setVisibility(event.target.checked)}
            />
          </label>

          <section className="flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-semibold">Tags du cours</h4>
              <p className="text-xs text-base-content/60">
                Ajoutez ou retirez les thèmes associés au cours.
              </p>
            </div>
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg border border-base-300 p-3">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className={`btn btn-xs ${
                      selected ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {selected && <Check className="h-3 w-3" />}
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </section>
        </form>

        <div className="flex justify-end gap-3 border-t border-base-300 bg-base-100 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            form={`edit-course-form-${course.id}`}
            className="btn btn-primary"
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting && (
              <span className="loading loading-spinner loading-sm" />
            )}
            Enregistrer
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
