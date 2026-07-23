import {
  Check,
  ChevronDown,
  ChevronRight,
  CloudOff,
  Eye,
  EyeOff,
  Plus,
  Save,
  X,
} from "lucide-react";
import Course from "../../../../../src/utils/interfaces/course";
import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import LessonItem from "./lesson-item";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import CourseActionsModal from "./course-actions-modal";
import CourseActions from "./course-actions";
import { AuthContext } from "../../../../store/AuthProvider";
import { toUpperFirstLetter } from "../../../../../src/utils/helpers/text-helpers";
import userBelongsToContacts from "../../../../utils/helpers/user-belongs-to-contacts";
import { cn } from "../../../../utils/cn";
import CreateLessonModal from "./create-lesson-modal";
import type { CourseFormValues } from "./course-form.types";

type CourseItemProps = {
  course: Course;
  moduleId?: number;
  selectedLesson: Lesson | undefined;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onPublishCourse: (courseId: number) => Promise<void>;
  onUpdateCourse: (
    courseId: number,
    values: CourseFormValues,
  ) => Promise<boolean>;
  onDeleteLesson: (lessonId: number) => Promise<void>;
  onCreateLesson: (
    courseId: number,
    data: {
      title: string;
      description: string;
      modalite: string;
      tagId: number;
    },
  ) => Promise<boolean>;
};

export type ModalCourseType =
  | "visibility"
  | "publish"
  | "deleteCourse"
  | "deleteLesson";

const CourseItem = ({
  course,
  moduleId,
  selectedLesson,
  onSelectLesson,
  onDeleteCourse,
  onEnableCourse,
  onPublishCourse,
  onUpdateCourse,
  onDeleteLesson,
  onCreateLesson,
  children,
}: PropsWithChildren<CourseItemProps>) => {
  const { user } = useContext(AuthContext);

  const canEditCourse = userBelongsToContacts(user, course.contacts);

  const [isCourseOpen, setCourseOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalCourseType>("visibility");
  const [selectedLessonToDelete, setSelectedLessonToDelete] = useState<
    Lesson | undefined
  >(undefined);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [editedTitle, setEditedTitle] = useState(course.title);
  const [editedDescription, setEditedDescription] = useState(
    course.description ?? "",
  );
  const [editedVisibility, setEditedVisibility] = useState(
    course.visibility ?? true,
  );

  const handleCreateLesson = async (data: {
    title: string;
    description: string;
    modalite: string;
    tagId: number;
  }) => {
    setIsSavingLesson(true);
    const created = await onCreateLesson(course.id, data);
    setIsSavingLesson(false);
    if (created) {
      setIsCreatingLesson(false);
      setCourseOpen(true);
    }
  };

  const handleUpdateCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editedTitle.trim()) return;
    setIsSavingCourse(true);
    const updated = await onUpdateCourse(course.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      visibility: editedVisibility,
    });
    setIsSavingCourse(false);
    if (updated) setIsEditingCourse(false);
  };

  // State for the expander button visibility
  const [showDescriptionExpander, setShowDescriptionExpander] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const courseProgress =
    course.lessons.reduce(
      (sum, lesson) =>
        sum +
        (lesson?.lessonsRead?.filter((lesson) => lesson.finishedAt).length ||
          0),
      0,
    ) / course.lessons.length;

  const isCourseCompleted = courseProgress === 1;

  const handleToggleCourseTab = () => {
    setCourseOpen(!isCourseOpen);
  };

  const handleClickMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOpenModal = (
    modalType: ModalCourseType,
    e?: React.MouseEvent,
  ) => {
    e?.stopPropagation();
    setModalType(modalType);
    setShowModal(true);
  };

  const handleOpenLessonDeletionModal = (lesson: Lesson) => {
    setSelectedLessonToDelete(lesson);
    handleOpenModal("deleteLesson");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsModalLoading(false);
  };

  const handleConfirmAction = async () => {
    setIsModalLoading(true);
    switch (modalType) {
      case "deleteCourse":
        await onDeleteCourse(course.id);
        break;
      case "deleteLesson":
        if (selectedLessonToDelete?.id) {
          await onDeleteLesson(selectedLessonToDelete.id);
          setSelectedLessonToDelete(undefined);
        }
        break;
      case "visibility":
        await onEnableCourse(course.id, !course.visibility);
        break;
      case "publish":
        await onPublishCourse(course.id);
        break;
      default:
        break;
    }
    handleCloseModal();
  };

  const handleClickToggleExpandDescription = () => {
    setDescriptionExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (
      selectedLesson &&
      course.lessons.some((lesson) => lesson.id === selectedLesson.id)
    ) {
      // The open state follows the lesson selected elsewhere in the explorer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCourseOpen(true);
    } else {
      setCourseOpen(false);
    }
  }, [course.lessons, selectedLesson]);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || !isCourseOpen) return;

    const checkOverflow = () => {
      // If height is 0, the element is likely still hidden/animating, skip calculation
      if (element.clientHeight === 0) return;

      const isOverflowing = element.scrollHeight > element.clientHeight + 1;
      setShowDescriptionExpander(isOverflowing);
    };

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    // Trigger once immediately
    checkOverflow();

    return () => observer.disconnect();
  }, [isCourseOpen, course.description]);

  return (
    <>
      <CreateLessonModal
        open={isCreatingLesson}
        courseTitle={course.title}
        isSaving={isSavingLesson}
        onClose={() => setIsCreatingLesson(false)}
        onSubmit={handleCreateLesson}
      />
      <CourseActionsModal
        modalType={modalType}
        showModal={showModal}
        isModalLoading={isModalLoading}
        course={course}
        lesson={selectedLessonToDelete}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmAction}
      />

      <div className="flex flex-col w-full relative select-none">
        {isEditingCourse && (
          <form
            className="mb-3 flex flex-col gap-3 rounded-xl bg-success p-4"
            onSubmit={handleUpdateCourse}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <input
                autoFocus
                className="input input-sm input-bordered w-full font-semibold"
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
                placeholder="Titre du cours"
              />
              <button
                type="submit"
                disabled={!editedTitle.trim() || isSavingCourse}
                className="btn btn-primary btn-sm btn-square"
                aria-label="Enregistrer le cours"
              >
                {isSavingCourse ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square text-base-100"
                onClick={() => setIsEditingCourse(false)}
                aria-label="Annuler"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              className="textarea textarea-bordered min-h-16 w-full resize-y text-sm"
              value={editedDescription}
              onChange={(event) => setEditedDescription(event.target.value)}
              placeholder="Description facultative"
            />
            <label className="flex cursor-pointer items-center justify-between text-xs text-base-100">
              Visible par les apprenants
              <input
                type="checkbox"
                className="toggle toggle-sm"
                checked={editedVisibility}
                onChange={(event) =>
                  setEditedVisibility(event.target.checked)
                }
              />
            </label>
          </form>
        )}
        {!course.isPublished ? (
          <div
            className="badge badge-info absolute -top-3 -left-3 tooltip tooltip-right tooltip-info z-11"
            data-tip="Ce cours n'est pas publié"
          >
            <CloudOff className="w-4 h-4 stroke-base-100" />
          </div>
        ) : null}
        <div
          className={`flex flex-col w-full cursor-pointer group ${
            isCourseOpen
              ? "bg-secondary/60 hover:bg-secondary/75"
              : "bg-secondary/50 hover:bg-secondary/75"
          } z-10 rounded-lg`}
          onClick={handleToggleCourseTab}
          onKeyDown={handleToggleCourseTab}
        >
          {/* Header Content */}
          <div className="flex flex-col gap-1 p-4">
            <div className="flex justify-between items-center gap-1">
              <span className="flex gap-1 items-center min-w-0">
                <div className="text-secondary-content">
                  {isCourseOpen ? (
                    <ChevronDown className="w-5" />
                  ) : (
                    <ChevronRight className="w-5" />
                  )}
                </div>
                <h3 className="font-semibold text-secondary-content/80 truncate">
                  {toUpperFirstLetter(course.title)}
                </h3>
              </span>
              {isCourseCompleted && (
                <Check className="text-success group-hover:text-primary-content" />
              )}
              {canEditCourse && (
                <div className="flex gap-1 items-center">
                  {course.isPublished ? (
                    <PermissionGuard action="update" object="course">
                      <button
                        onClick={(e) => handleOpenModal("visibility", e)}
                        className={cn("btn btn-xs tooltip ", {
                          "btn-info": course.visibility,
                          "btn-neutral": !course.visibility,
                        })}
                        data-tip={
                          course.visibility
                            ? "Rendre le cours invisible"
                            : "Rendre le cours visible"
                        }
                      >
                        {course.visibility ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </button>
                    </PermissionGuard>
                  ) : null}

                  <PermissionGuard action="write" object="course">
                    <CourseActions
                      course={course}
                      onOpenModal={handleOpenModal}
                      onEdit={(event) => {
                        event.stopPropagation();
                        setEditedTitle(course.title);
                        setEditedDescription(course.description ?? "");
                        setEditedVisibility(course.visibility ?? true);
                        setIsEditingCourse(true);
                      }}
                      onClickMenu={handleClickMenu}
                    />
                  </PermissionGuard>
                </div>
              )}
            </div>
          </div>
          <PermissionGuard action="component" object="progression">
            <progress
              className={cn(
                "w-full progress progress-primary bg-secondary rounded-b-full -mt-1.5 transition-all",
              )}
              value={isNaN(courseProgress) ? 0 : courseProgress}
            />
          </PermissionGuard>
        </div>
        <motion.div
          className="bg-secondary/20 rounded-b-xl overflow-y-auto -mt-2 pt-2"
          initial={{ maxHeight: 0 }}
          style={{
            height: isCourseOpen ? "auto" : 0,
            visibility: isCourseOpen ? "visible" : "hidden",
          }}
          animate={{
            maxHeight: isCourseOpen ? 500 : 0,
          }}
        >
          <div className="p-4 flex flex-col gap-4">
            {course.description && (
              <span className="flex-1 min-w-0">
                <p
                  ref={descriptionRef}
                  className={`text-sm wrap-break-word overflow-hidden min-w-0 ${
                    !isDescriptionExpanded ? "line-clamp-1" : ""
                  }`}
                >
                  {toUpperFirstLetter(course.description)}
                </p>

                {/* Render the button based on the state calculated in useEffect */}
                {(showDescriptionExpander || isDescriptionExpanded) && (
                  <span
                    className="text-xs link cursor-pointer select-"
                    onClick={handleClickToggleExpandDescription}
                  >
                    {`Voir ${isDescriptionExpanded ? "moins" : "plus"}`}
                  </span>
                )}
              </span>
            )}

            <div className="flex items-center justify-between border-b border-secondary/30 pb-2">
              <div className="text-xs font-semibold text-base-content/60 flex items-center gap-0.5">
                <span>Leçons</span>
                <span>
                  {(course.lessons.length || 0) > 1
                    ? `(${course.lessons.length})`
                    : null}
                </span>
              </div>
              <PermissionGuard action="write" object="course">
                <button
                  className="btn btn-secondary btn-xs gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreatingLesson(true);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter une leçon
                </button>
              </PermissionGuard>
            </div>

            {/* Lessons List */}
            {course.lessons.length > 0 ? (
              course.lessons.map(
                (lesson) =>
                  lesson.id && (
                    <div className={`w-full`} key={lesson.id}>
                      <LessonItem
                        lesson={lesson}
                        moduleId={moduleId}
                        selectedLesson={selectedLesson}
                        canEditLesson={canEditCourse}
                        onSelectLesson={onSelectLesson}
                        onOpenModal={handleOpenLessonDeletionModal}
                      >
                        {children}
                      </LessonItem>
                    </div>
                  ),
              )
            ) : (
              <div className="text-center">
                <p className="text-base-content/60 text-sm">
                  Aucune leçon disponible pour ce cours
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CourseItem;
