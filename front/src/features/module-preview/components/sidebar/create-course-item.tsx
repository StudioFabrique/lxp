import { Check, Import, Plus } from "lucide-react";
import { Link } from "react-router";
import { FormEvent, useRef, useState } from "react";
import { motion } from "motion/react";
import type { CreateCourseFormValues } from "./course-form.types";
import CreateCourseDetailsModal from "./create-course-details-modal";

type CreateCourseItemProps = {
  parcoursId?: number;
  moduleId: number;
  onCreate: (values: CreateCourseFormValues) => Promise<number | false>;
  onCreated?: (courseId: number) => void;
  openDetailsOnMount?: boolean;
};

const CreateCourseItem = ({
  parcoursId,
  moduleId,
  onCreate,
  onCreated,
  openDetailsOnMount = false,
}: CreateCourseItemProps) => {
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(openDetailsOnMount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const validationButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenDetails = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setShowDetailsForm(true);
  };

  const handleCreate = async (values: CreateCourseFormValues) => {
    setIsSubmitting(true);
    const courseId = await onCreate(values);
    setIsSubmitting(false);
    if (courseId) {
      setTitle("");
      setShowDetailsForm(false);
      setShowTitleInput(false);
      onCreated?.(courseId);
    }
    return courseId !== false;
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
          onClose={() => setShowDetailsForm(false)}
          onSubmit={handleCreate}
        />
      )}
      <motion.div
        className={`flex w-full flex-col gap-4 rounded-xl ${
          showTitleInput ? "bg-success" : ""
        }`}
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
                className="input input-sm input-bordered w-full font-semibold"
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
                className="btn btn-primary/50 disabled:bg-primary/50 btn-sm"
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
