import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseTitleSchema } from "../../assignment.schema";
import { useFormField } from "../../../../components/form/useFormField";
import { showFormErrors } from "../../../../components/form/form-errors";
import { Check, Import, Plus } from "lucide-react";
import { Link } from "react-router";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { CourseContentValues, CreateCourseFormValues } from "./course-form.types";
import CreateCourseDetailsModal from "./create-course-details-modal";
import CourseContentModal from "./course-content-modal";
import type Tag from "../../../../utils/interfaces/tag";
import { cn } from "../../../../utils/cn";

type CreateCourseItemProps = {
  parcoursId?: number;
  moduleId: number;
  parcoursTags: Tag[];
  onCreate: (values: CreateCourseFormValues) => Promise<number | false>;
  onAddContent: (courseId: number, values: CourseContentValues) => Promise<boolean>;
  onCreated?: (courseId: number) => void;
  openDetailsOnMount?: boolean;
};

const CreateCourseItem = ({
  parcoursId,
  moduleId,
  parcoursTags,
  onCreate,
  onAddContent,
  onCreated,
  openDetailsOnMount = false,
}: CreateCourseItemProps) => {
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(openDetailsOnMount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Cours tout juste créé : son contenu est proposé dans une seconde modale.
  const [contentCourse, setContentCourse] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const form = useForm({
    resolver: zodResolver(courseTitleSchema),
    defaultValues: { title: "" },
  });
  const [title, setTitle] = useFormField(form, "title");
  const validationButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenDetails = form.handleSubmit(() => {
    if (!title.trim()) return;
    setShowDetailsForm(true);
  }, showFormErrors);

  const handleCreate = async (values: CreateCourseFormValues) => {
    setIsSubmitting(true);
    const courseId = await onCreate(values);
    setIsSubmitting(false);
    if (courseId) {
      setTitle("");
      setShowDetailsForm(false);
      setShowTitleInput(false);
      onCreated?.(courseId);
      setContentCourse({ id: courseId, title: values.title.trim() });
    }
    return courseId !== false;
  };

  const handleAddContent = async (values: CourseContentValues) => {
    if (!contentCourse) return false;
    setIsAddingContent(true);
    const success = await onAddContent(contentCourse.id, values);
    setIsAddingContent(false);
    return success;
  };

  const closeTitleInput = () => {
    setTitle("");
    setShowTitleInput(false);
  };

  return (
    <>
      {showDetailsForm && (
        <CreateCourseDetailsModal
          initialTitle={title}
          isSubmitting={isSubmitting}
          parcoursTags={parcoursTags}
          onClose={() => setShowDetailsForm(false)}
          onSubmit={handleCreate}
        />
      )}
      {contentCourse && (
        <CourseContentModal
          parcoursTags={parcoursTags}
          isSubmitting={isAddingContent}
          onClose={() => setContentCourse(null)}
          onSubmit={handleAddContent}
        />
      )}
      <motion.div
        className={cn(
          "flex w-full flex-col gap-4 rounded-xl",
          showTitleInput && "bg-success",
        )}
        initial={{ scale: 0.95, padding: 0 }}
        animate={{
          scale: 1,
          padding: showTitleInput ? 8 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {showTitleInput ? (
          <form onSubmit={handleOpenDetails}>
            <div className="flex items-center gap-2">
              <input
                autoFocus
                className="input input-sm input-bordered w-full bg-base-100 font-semibold text-base-content placeholder:text-base-content/70"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={(event) => {
                  if (
                    validationButtonRef.current?.contains(
                      event.relatedTarget as Node,
                    )
                  ) {
                    return;
                  }
                  closeTitleInput();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeTitleInput();
                }}
                placeholder="Titre du cours"
              />
              <button
                ref={validationButtonRef}
                type="submit"
                disabled={!title.trim()}
                className="btn btn-primary btn-sm disabled:border-base-100 disabled:bg-base-100 disabled:text-base-content/70"
                aria-label="Continuer"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex w-full items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTitleInput(true)}
              data-chatbot-target="module-add-course"
              className="btn btn-success flex-1 justify-between rounded-xl text-base-100"
            >
              Ajouter un cours
              <Plus />
            </button>
            <Link
              to="/admin/course/import"
              state={{ parcoursId, moduleId }}
              className="btn btn-primary shrink-0 text-base-100 tooltip tooltip-left"
              data-tip="Importer des cours"
              aria-label="Importer des cours"
            >
              <Import size={20} />
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CreateCourseItem;
