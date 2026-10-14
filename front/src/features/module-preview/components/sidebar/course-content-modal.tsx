import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

import { courseContentSchema } from "../../assignment.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import type Tag from "../../../../utils/interfaces/tag";
import CourseContentImport from "./course-content-import";
import type { CourseContentValues } from "./course-form.types";

type Props = {
  /** Tags du module, proposés pour rechercher du contenu existant. */
  parcoursTags: Tag[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CourseContentValues) => Promise<boolean>;
};

export default function CourseContentModal({
  parcoursTags,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const form = useForm({
    resolver: zodResolver(courseContentSchema),
    defaultValues: { selectedContents: [] },
  });
  const [selectedContents, setSelectedContents] = useFormField(
    form,
    "selectedContents",
  );

  const handleSubmit = form.handleSubmit(async ({ selectedContents }) => {
    if (isSubmitting) return;
    const success = await onSubmit({
      lessonIds: selectedContents
        .filter((content) => content.source === "lesson")
        .map((content) => content.id),
      resourceIds: selectedContents
        .filter((content) => content.source === "resource")
        .map((content) => content.id),
    });
    if (success) onClose();
  }, showFormErrors);

  return createPortal(
    <dialog className="modal modal-open z-100">
      <div className="modal-box flex min-h-[36rem] max-h-[90vh] w-11/12 max-w-3xl flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h3 className="text-lg font-bold">Importer du contenu</h3>
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
          id="course-content-form"
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5"
          onSubmit={handleSubmit}
        >
          <CourseContentImport
            parcoursTags={parcoursTags}
            selectedContents={selectedContents}
            onSelectedContentsChange={setSelectedContents}
          />
        </form>

        <div className="flex justify-end gap-3 border-t border-base-300 px-6 py-4">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
            Passer
          </button>
          <button
            type="submit"
            form="course-content-form"
            className="btn btn-primary"
            disabled={selectedContents.length === 0 || isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
            Importer le contenu
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
