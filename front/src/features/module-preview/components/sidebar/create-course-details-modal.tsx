import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseDetailsSchema } from "../../assignment.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { LoaderCircle, Check, X } from "lucide-react";
import { createPortal } from "react-dom";

import type Tag from "../../../../utils/interfaces/tag";
import type { CreateCourseFormValues } from "./course-form.types";
import { cn } from "../../../../utils/cn";
import AssignmentFields from "./assignment-fields";
import {
  assignmentFormIsValid,
  emptyAssignmentForm,
} from "./assignment-form.helpers";

type Props = {
  initialTitle: string;
  isSubmitting: boolean;
  parcoursTags: Tag[];
  onClose: () => void;
  onSubmit: (values: CreateCourseFormValues) => Promise<boolean>;
};

export default function CreateCourseDetailsModal({
  initialTitle,
  isSubmitting,
  parcoursTags,
  onClose,
  onSubmit,
}: Props) {
  const form = useForm({
    resolver: zodResolver(courseDetailsSchema),
    defaultValues: {
      title: initialTitle,
      description: "",
      visibility: true,
      tagIds: [],
      assignment: emptyAssignmentForm(),
    },
  });
  const [title, setTitle] = useFormField(form, "title");
  const [description, setDescription] = useFormField(form, "description");
  const [selectedTagIds, setSelectedTagIds] = useFormField(form, "tagIds");
  const [assignment, setAssignment] = useFormField(form, "assignment");

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.length > 1
          ? current.filter((id) => id !== tagId)
          : current
        : [...current, tagId],
    );
  };

  // Motif affiché en infobulle tant que le bouton de création est désactivé.
  const submitBlockReason = !title.trim()
    ? "Renseignez le titre du cours."
    : selectedTagIds.length === 0
      ? "Sélectionnez au moins un tag pour créer le cours."
      : !assignmentFormIsValid(assignment)
        ? "Complétez les informations du devoir."
        : null;

  const handleSubmit = form.handleSubmit(
    async (values) => {
      if (isSubmitting) return;
      const success = await onSubmit(values);
      if (success) onClose();
    },
    showFormErrors,
  );

  return createPortal(
    <dialog className="modal modal-open z-100">
      <div
        className="modal-box flex max-h-[90vh] w-11/12 max-w-3xl flex-col overflow-hidden p-0"
      >
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold">Ajouter un cours</h3>
            <p className="text-sm text-base-content/60">
              Complétez les informations du cours. Son contenu s'importe à l'étape suivante.
            </p>
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
          id="create-course-details-form"
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2">
            <span
              className="text-sm font-semibold"
            >
              Titre *
            </span>
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
              className="textarea textarea-bordered min-h-24 w-full resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Décrivez brièvement ce cours."
            />
          </label>

          <section
            className="flex flex-col gap-3"
          >
            <div>
              <h4
                className="text-sm font-semibold"
              >
                Tags du cours *
              </h4>
              <p className="text-xs text-base-content/60">
                Sélectionnez au moins un thème pour classer le cours.
              </p>
            </div>
            <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-lg border border-base-300 p-3">
              {parcoursTags.length ? (
                parcoursTags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "btn btn-sm border-2",
                        selected
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: tag.color }}
                      aria-pressed={selected}
                      disabled={selected && selectedTagIds.length === 1}
                    >
                      {selected && <Check className="h-3 w-3" />}
                      {tag.name}
                    </button>
                  );
                })
              ) : (
                <span className="text-sm text-base-content/50">
                  Aucun tag disponible
                </span>
              )}
            </div>
          </section>

          <AssignmentFields value={assignment} onChange={setAssignment} />
        </form>

        <div className="flex justify-end gap-3 border-t border-base-300 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          {/* Le survol d'un bouton désactivé n'est pas fiable : l'infobulle est portée par le conteneur. */}
          <div
            className={cn(submitBlockReason && "tooltip tooltip-top")}
            data-tip={submitBlockReason ?? undefined}
          >
            <button
              type="submit"
              form="create-course-details-form"
              className="btn btn-primary"
              disabled={Boolean(submitBlockReason) || isSubmitting}
            >
              {isSubmitting && (
                <LoaderCircle className="size-4 animate-spin" />
              )}
              Créer le cours
            </button>
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
