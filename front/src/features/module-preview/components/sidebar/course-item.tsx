import {
  Check,
  ChevronDown,
  ChevronRight,
  CloudOff,
  Eye,
  EyeOff,
} from "lucide-react";
import Course from "../../../../../src/utils/interfaces/course";
import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import LessonItem from "./lesson-item";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import CourseActionsModal from "./course-actions-modal";
import CourseActions from "./course-actions";
import { AuthContext } from "../../../../store/AuthProvider";
import { toUpperFirstLetter } from "../../../../../src/utils/helpers/text-helpers";
import userBelongsToContacts from "../../../../utils/helpers/user-belongs-to-contacts";
import { Link } from "react-router";
import { cn } from "../../../../utils/cn";

type CourseItemProps = {
  course: Course;
  parcoursId?: number;
  moduleId?: number;
  selectedLesson: Lesson | undefined;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onPublishCourse: (courseId: number) => Promise<void>;
  onDeleteLesson: (lessonId: number) => Promise<void>;
};

export type ModalCourseType =
  | "visibility"
  | "publish"
  | "deleteCourse"
  | "deleteLesson";

const CourseItem = ({
  course,
  parcoursId,
  moduleId,
  selectedLesson,
  onSelectLesson,
  onDeleteCourse,
  onEnableCourse,
  onPublishCourse,
  onDeleteLesson,
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
                        className={cn("btn btn-sm tooltip ", {
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
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </PermissionGuard>
                  ) : null}

                  <PermissionGuard action="write" object="course">
                    <CourseActions
                      course={course}
                      parcoursId={parcoursId}
                      moduleId={moduleId}
                      onOpenModal={handleOpenModal}
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
                <PermissionGuard action="write" object="course">
                  <Link
                    to="/admin/lesson/add"
                    state={{
                      parcoursId,
                      moduleId,
                      courseId: course.id,
                    }}
                    className="text-xs link link-hover text-primary"
                  >
                    Créer la première leçon
                  </Link>
                </PermissionGuard>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CourseItem;
