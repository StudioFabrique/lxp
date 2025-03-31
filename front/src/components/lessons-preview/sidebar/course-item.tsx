import {
  ArrowDown,
  ArrowRight,
  Edit,
  EyeOff,
  ListPlus,
  MoreVertical,
  Trash,
} from "lucide-react";
import Course from "../../../utils/interfaces/course";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LessonItem from "./lesson-item";
import Lesson from "../../../utils/interfaces/lesson";
import Can from "../../UI/can/can.component";
import { Link } from "react-router-dom";
import TableActionsModal from "../../table/table-buttons/table-actions-modal";

type CourseItemProps = {
  course: Course;
  parcoursId: number;
  moduleId: number;
  selectedLesson: Lesson | undefined;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
};

const CourseItem = ({
  course,
  parcoursId,
  moduleId,
  selectedLesson,
  setSelectedLesson,
  onDeleteCourse,
}: CourseItemProps) => {
  const [isCourseOpen, setCourseOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsModalLoading(false);
  };

  const handleConfirmAction = async () => {
    setIsModalLoading(true);
    await onDeleteCourse(course.id);
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
      <TableActionsModal
        isOpen={showModal}
        onCancel={handleCloseModal}
        title="Supprimer le cours"
        description="Êtes-vous sûr de vouloir supprimer ce cours ainsi que les leçons associés ?"
        descList={[course.title]}
        alertMessageBottom="Cette action est irréversible."
      >
        <button
          className={`btn btn-error btn-md text-warning ${isModalLoading && "loading"}`}
          onClick={handleConfirmAction}
        >
          Confirmer
        </button>
      </TableActionsModal>
      <div className="flex flex-col w-full relative">
        {!course.isPublished || !course.visibility ? (
          <div
            className="badge badge-info absolute -top-3 -left-3 tooltip tooltip-right"
            data-tip={`Le cours est ${!course.visibility ? "invisible" : ""} ${!course.visibility && !course.isPublished ? "et" : ""} ${!course.isPublished ? "non publié" : ""}`}
          >
            <EyeOff className="w-4 h-4 stroke-base-100" />
          </div>
        ) : null}

        <div
          className="flex flex-col w-full cursor-pointer"
          onClick={handleToggleCourseTab}
        >
          <div
            className={`flex flex-col gap-1 bg-secondary/80 p-4 rounded-xl ${isCourseOpen ? "rounded-b-none" : null}`}
          >
            {/* Titre du cours + tooltip */}

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
                <div
                  onClick={handleClickMenu}
                  className="dropdown dropdown-right z-10"
                >
                  <button className="flex cursor-pointer">
                    <MoreVertical className="stroke-secondary-content w-7 h-7 hover:bg-primary/20 px-1 rounded-lg transition-colors" />
                  </button>

                  <div className="dropdown-content menu translate-x-5 -translate-y-3 bg-base-300/80 text-base-content rounded-lg w-60 backdrop-blur-sm border border-primary/20">
                    <Can action="update" object="course">
                      <Link
                        to={`/admin/course/edit/${course.id}`}
                        className="cursor-default flex items-center px-4 py-3 text-sm hover:bg-primary/20 transition-all first:rounded-t-lg"
                      >
                        <Edit className="w-4 h-4 mr-3" />
                        Modifier le cours
                      </Link>
                    </Can>

                    <Link
                      to="/admin/lesson/add"
                      state={{
                        parcoursId,
                        moduleId,
                        courseId: course.id,
                      }}
                      className="cursor-default flex items-center px-4 py-3 text-sm hover:bg-primary/20 transition-all"
                    >
                      <ListPlus className="w-4 h-4 mr-3" />
                      Ajouter une leçon
                    </Link>

                    <Can action="delete" object="course">
                      <button
                        onClick={handleOpenModal}
                        className="cursor-default flex items-center w-full px-4 py-3 text-sm text-error hover:bg-error/10 transition-all last:rounded-b-lg"
                      >
                        <Trash className="w-4 h-4 mr-3" />
                        Supprimer le cours
                      </button>
                    </Can>
                  </div>
                </div>
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
              className="w-full progress progress-primary bg-secondary -mt-[8px] rounded-b-full"
              value={courseProgress}
            />
          </Can>
        </div>
        <motion.div
          className="bg-secondary/20 rounded-b-xl overflow-y-auto"
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
