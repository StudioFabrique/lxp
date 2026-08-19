import {
  Check,
  ChevronDown,
  ChevronRight,
  CloudOff,
  EyeOff,
  Plus,
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
import { AbilityContext } from "../../../../rbac/AbilityProvider";
import { cn } from "../../../../utils/cn";
import CreateLessonModal from "./create-lesson-modal";
import type { UpdateCourseFormValues } from "./course-form.types";
import EditCourseModal from "./edit-course-modal";
import type { LessonFormValues } from "./lesson-form.types";
import { emitOnboardingEvent } from "../../../onboarding/onboarding-events";

type CourseItemProps = {
  course: Course;
  selectedLesson: Lesson | undefined;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onPublishCourse: (courseId: number) => Promise<void>;
  onUpdateCourse: (
    courseId: number,
    values: UpdateCourseFormValues,
  ) => Promise<boolean>;
  openEditOnMount?: boolean;
  editLessonId?: number;
  isOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onDeleteLesson: (lessonId: number) => Promise<void>;
  onCreateLesson: (
    courseId: number,
    data: {
      title: string;
      description: string;
      modalite: string;
      tagId: number;
    },
  ) => Promise<number | false>;
  onLessonCreated?: (lessonId: number) => void;
  onUpdateLesson: (
    lessonId: number,
    values: LessonFormValues,
  ) => Promise<boolean>;
};

export type ModalCourseType =
  | "visibility"
  | "publish"
  | "deleteCourse"
  | "deleteLesson";

const CourseItem = ({
  course,
  selectedLesson,
  onSelectLesson,
  onDeleteCourse,
  onEnableCourse,
  onPublishCourse,
  onUpdateCourse,
  openEditOnMount = false,
  editLessonId,
  isOpen: isCourseOpen,
  onToggle,
  onOpen,
  onDeleteLesson,
  onCreateLesson,
  onLessonCreated,
  onUpdateLesson,
  children,
}: PropsWithChildren<CourseItemProps>) => {
  const { user } = useContext(AuthContext);
  const ability = useContext(AbilityContext);

  const canEditCourse =
    ability.can("update", "course") ||
    userBelongsToContacts(user, course.contacts);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalCourseType>("visibility");
  const [selectedLessonToDelete, setSelectedLessonToDelete] = useState<
    Lesson | undefined
  >(undefined);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(openEditOnMount);
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  const handleCreateLesson = async (data: {
    title: string;
    description: string;
    modalite: string;
    tagId: number;
  }): Promise<boolean> => {
    setIsSavingLesson(true);
    const lessonId = await onCreateLesson(course.id, data);
    setIsSavingLesson(false);
    if (lessonId) {
      setIsCreatingLesson(false);
      onOpen();
      onLessonCreated?.(lessonId);
    }
    return lessonId !== false;
  };

  const handleUpdateCourse = async (values: UpdateCourseFormValues) => {
    setIsSavingCourse(true);
    const updated = await onUpdateCourse(course.id, values);
    setIsSavingCourse(false);
    return updated;
  };

  // State for the expander button visibility
  const [showDescriptionExpander, setShowDescriptionExpander] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Fourni par l'API (`calculate-module-progress.ts`), en pourcentage.
  const courseProgress = course.stats?.progress ?? 0;
  const isCourseCompleted = courseProgress === 100;

  const handleToggleCourseTab = () => {
    onToggle();
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
        courseTags={course.tags ?? []}
        isSaving={isSavingLesson}
        onClose={() => setIsCreatingLesson(false)}
        onSubmit={handleCreateLesson}
      />
      {isEditingCourse && (
        <EditCourseModal
          course={course}
          isSubmitting={isSavingCourse}
          onClose={() => setIsEditingCourse(false)}
          onSubmit={handleUpdateCourse}
        />
      )}
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
        {!course.isPublished ? (
          <div
            className="badge badge-info absolute -top-3 -left-3 tooltip tooltip-right tooltip-info z-11"
            data-tip="Ce cours n'est pas publié"
          >
            <CloudOff className="w-4 h-4" />
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
                {course.isPublished && !course.visibility && (
                  <div
                    className={cn("tooltip ml-1.5")}
                    data-tip="Cours invisible"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </div>
                )}
              </span>
              {isCourseCompleted && (
                <Check className="text-success group-hover:text-primary-content" />
              )}
              {canEditCourse && (
                <div className="flex gap-1 items-center">
                  <PermissionGuard action="write" object="course">
                    <button
                      data-onboarding="lesson-create"
                      className="btn btn-success btn-xs gap-1 tooltip"
                      data-tip="Créer une leçon"
                      onClick={(e) => {
                        e.stopPropagation();
                        emitOnboardingEvent({ type: "lesson_form_opened" });
                        setIsCreatingLesson(true);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </PermissionGuard>

                  <PermissionGuard action="update" object="course">
                    <CourseActions
                      course={course}
                      onOpenModal={handleOpenModal}
                      onEdit={(event) => {
                        event.stopPropagation();
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
              value={courseProgress}
              max={100}
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

            {/* Lessons List */}
            {course.lessons.length > 0 ? (
              course.lessons.map(
                (lesson) =>
                  lesson.id && (
                    <div className={`w-full`} key={lesson.id}>
                      <LessonItem
                        lesson={lesson}
                        courseTags={course.tags ?? []}
                        selectedLesson={selectedLesson}
                        canEditLesson={canEditCourse}
                        openEditOnMount={lesson.id === editLessonId}
                        onSelectLesson={onSelectLesson}
                        onOpenModal={handleOpenLessonDeletionModal}
                        onUpdateLesson={onUpdateLesson}
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
