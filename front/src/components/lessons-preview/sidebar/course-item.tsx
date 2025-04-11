import { ArrowDown, ArrowRight, EyeOff } from "lucide-react";
import Course from "../../../utils/interfaces/course";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LessonItem from "./lesson-item";
import Lesson from "../../../utils/interfaces/lesson";
import Can from "../../UI/can/can.component";
import CourseActionsModal from "./course-actions-modal";
import CourseActions from "./course-actions";

type CourseItemProps = {
  course: Course;
  parcoursId: number;
  moduleId: number;
  selectedLesson: Lesson | undefined;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
};

const CourseItem = ({
  course,
  parcoursId,
  moduleId,
  selectedLesson,
  setSelectedLesson,
  onDeleteCourse,
  onEnableCourse,
}: CourseItemProps) => {
  const [isCourseOpen, setCourseOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"visibility" | "delete">(
    "visibility",
  );
  const [isModalLoading, setIsModalLoading] = useState(false);

  const courseProgress = (
    course.lessons.reduce(
      (sum, lesson) =>
        sum +
        (lesson?.lessonsRead?.filter((lesson) => lesson.finishedAt).length ||
          0),
      0,
    ) / course.lessons.length
  ).toString();

  const handleToggleCourseTab = () => {
    setCourseOpen(!isCourseOpen);
  };

  const handleClickMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOpenModal = (
    e: React.MouseEvent,
    modalType: "visibility" | "delete",
  ) => {
    e.stopPropagation();
    setModalType(modalType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsModalLoading(false);
  };

  const handleConfirmAction = async () => {
    setIsModalLoading(true);
    switch (modalType) {
      case "delete":
        await onDeleteCourse(course.id);
        break;
      case "visibility":
        await onEnableCourse(course.id, !course.visibility);
        break;
    }
    handleCloseModal();
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

  return (
    <>
      <CourseActionsModal
        title={modalType === "visibility" ? "Visibilité" : "Supprimer le cours"}
        description={
          modalType === "visibility"
            ? `Êtes-vous sûr de vouloir  ${course.visibility ? "cacher" : "rendre visible"} ce cours ?`
            : "Êtes-vous sûr de vouloir supprimer ce cours ainsi que les leçons associés ?"
        }
        showModal={showModal}
        isModalLoading={isModalLoading}
        course={course}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
      <div className="flex flex-col w-full relative">
        {!course.isPublished || !course.visibility ? (
          <div
            className="badge badge-info absolute -top-3 -left-3 tooltip tooltip-right tooltip-info z-[15]"
            data-tip={`Le cours est ${!course.visibility ? "invisible" : ""} ${!course.visibility && !course.isPublished ? "et" : ""} ${!course.isPublished ? "non publié" : ""}`}
          >
            <EyeOff className="w-4 h-4 stroke-base-100" />
          </div>
        ) : null}

        <div
          className="flex flex-col w-full cursor-pointer bg-secondary rounded-lg"
          onClick={handleToggleCourseTab}
        >
          <div className={`flex flex-col gap-1 p-4`}>
            <div className="flex justify-between items-center gap-1">
              <span
                data-tip={`Titre : ${course.title}`}
                className="flex items-center tooltip tooltip-right capitalize min-w-0"
              >
                <h3 className="text-secondary-content/80 capitalize truncate">
                  {course.title}
                </h3>
              </span>
              <Can action="write" object="course">
                <CourseActions
                  course={course}
                  parcoursId={parcoursId}
                  moduleId={moduleId}
                  onOpenModal={handleOpenModal}
                  onClickMenu={handleClickMenu}
                />
              </Can>
            </div>

            <div className="flex justify-between items-center gap-5 p-1 min-w-0">
              <span
                data-tip={`Description : ${course.description}`}
                className="tooltip tooltip-right flex-1 min-w-0"
              >
                <p className="text-secondary-content font-semibold text-sm w-[80%] max-h-10 break-words overflow-y-clip min-w-0">
                  {course.description}
                </p>
              </span>
              <div className="flex-shrink-0 ">
                {isCourseOpen ? (
                  <ArrowDown className="stroke-primary-content" />
                ) : (
                  <ArrowRight className="stroke-primary-content" />
                )}
              </div>
            </div>
          </div>
          <Can action="component" object="progression">
            <progress
              className="w-full progress progress-primary bg-secondary rounded-b-full -mt-[8px]"
              value={courseProgress}
            />
          </Can>
        </div>
        <motion.div
          className="bg-secondary/20 rounded-b-xl overflow-y-auto -mt-2 pt-2"
          initial={{ maxHeight: 0 }}
          style={{
            height: isCourseOpen ? "auto" : 0,
            visibility: isCourseOpen ? "visible" : "hidden",
          }}
          animate={{
            maxHeight: isCourseOpen ? 280 : 0,
          }}
        >
          <div className="p-4 flex flex-col gap-4 items-center">
            {course.lessons.length > 0 ? (
              course.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  lessonsOrders={course.lessons.map(
                    (lesson) => lesson.order ?? 0,
                  )}
                  moduleId={moduleId}
                  selectedLesson={selectedLesson}
                  setSelectedLesson={setSelectedLesson}
                />
              ))
            ) : (
              <p>Aucune leçon</p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CourseItem;
