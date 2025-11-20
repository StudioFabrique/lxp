import { ChevronDown, ChevronRight, EyeOff } from "lucide-react";
import Course from "../../../utils/interfaces/course";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LessonItem from "./lesson-item";
import Lesson from "../../../utils/interfaces/lesson";
import Can from "../../UI/can/can.component";
import CourseActionsModal from "./course-actions-modal";
import CourseActions from "./course-actions";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import hasPermission from "../../../utils/hasPermission";
import { Context } from "../../../store/context.store";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";

type CourseItemProps = {
  course: Course;
  parcoursId: number;
  moduleId: number;
  selectedLesson: Lesson | undefined;
  onSelectLesson: (lesson: Lesson) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
  onLessonReorder: OnDragEndResponder;
  onEnableCourse: (courseId: number, visibility: boolean) => Promise<void>;
  onDeleteLesson: (lessonId: number) => Promise<void>;
};

type ModalType = "visibility" | "deleteCourse" | "deleteLesson";

const CourseItem = ({
  course,
  parcoursId,
  moduleId,
  selectedLesson,
  onSelectLesson,
  onDeleteCourse,
  onLessonReorder,
  onEnableCourse,
  onDeleteLesson,
  children,
}: PropsWithChildren<CourseItemProps>) => {
  const { user } = useContext(Context);
  const [isCourseOpen, setCourseOpen] = useState(false);
  const [isDragAndDropEnabled, setDragAndDropEnabled] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("visibility");
  const [selectedLessonToDelete, setSelectedLessonToDelete] = useState<
    Lesson | undefined
  >(undefined);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  const courseProgress = (
    course.lessons.reduce(
      (sum, lesson) =>
        sum +
        (lesson?.lessonsRead?.filter((lesson) => lesson.finishedAt).length ||
          0),
      0
    ) / course.lessons.length
  ).toString();

  const handleToggleCourseTab = () => {
    setCourseOpen(!isCourseOpen);
  };

  const handleClickMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOpenModal = (modalType: ModalType, e?: React.MouseEvent) => {
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
    }
    handleCloseModal();
  };

  const handleClickChangeCourseOrder = () => {
    setDragAndDropEnabled((prev) => !prev);
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

  return (
    <>
      <CourseActionsModal
        title={
          modalType === "visibility"
            ? "Visibilité"
            : modalType === "deleteLesson"
            ? "Supprimer la leçon"
            : "Supprimer le cours"
        }
        description={
          modalType === "visibility"
            ? `Êtes-vous sûr de vouloir  ${
                course.visibility ? "cacher" : "rendre visible"
              } ce cours ?`
            : modalType === "deleteLesson"
            ? "Êtes-vous sûr de vouloir supprimer cette leçon ainsi que les activités associées ?"
            : "Êtes-vous sûr de vouloir supprimer ce cours ainsi que les leçons associées ?"
        }
        showModal={showModal}
        isModalLoading={isModalLoading}
        course={course}
        lesson={selectedLessonToDelete}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
      <div className="flex flex-col w-full relative">
        {!course.isPublished || !course.visibility ? (
          <div
            className="badge badge-info absolute -top-3 -left-3 tooltip tooltip-right tooltip-info z-[11]"
            data-tip={`Le cours est ${!course.visibility ? "invisible" : ""} ${
              !course.visibility && !course.isPublished ? "et" : ""
            } ${!course.isPublished ? "non publié" : ""}`}
          >
            <EyeOff className="w-4 h-4 stroke-base-100" />
          </div>
        ) : null}

        <div
          className="flex flex-col w-full cursor-pointer bg-secondary z-10 rounded-lg"
          onClick={handleToggleCourseTab}
          onKeyDown={handleToggleCourseTab}
        >
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
              <div className="flex items-center">
                <Can action="write" object="course">
                  <CourseActions
                    course={course}
                    parcoursId={parcoursId}
                    moduleId={moduleId}
                    isDragAndDropEnabled={isDragAndDropEnabled}
                    onOpenModal={handleOpenModal}
                    onClickMenu={handleClickMenu}
                    onClickChangeCourseOrder={handleClickChangeCourseOrder}
                  />
                </Can>
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
            maxHeight: isCourseOpen ? 500 : 0,
          }}
        >
          <DragDropContext onDragEnd={onLessonReorder}>
            <Droppable
              isDropDisabled={
                !isDragAndDropEnabled ||
                !hasPermission(user?.permissions || [], "update", "lesson")
              }
              droppableId="droppable"
            >
              {(provided, droppableState) => (
                <div
                  ref={provided.innerRef}
                  className={`p-4 flex flex-col gap-4 items-center ${
                    droppableState.isDraggingOver && "-mt-10"
                  }`}
                  {...provided.droppableProps}
                >
                  {provided.placeholder}
                  <span className="flex-1 min-w-0">
                    <p
                      className={`text-sm break-words overflow-y-clip min-w-0 ${
                        !isDescriptionExpanded && "max-h-5"
                      }`}
                    >
                      {toUpperFirstLetter(course.description)}
                    </p>
                    <p
                      className="text-xs link"
                      onClick={handleClickToggleExpandDescription}
                    >
                      {`Voir ${isDescriptionExpanded ? "moins" : "plus"}`}
                    </p>
                  </span>
                  {course.lessons.length > 0 ? (
                    course.lessons.map(
                      (lesson, index) =>
                        lesson.id && (
                          <Draggable
                            key={lesson.id}
                            draggableId={lesson.id.toString()}
                            index={index}
                            isDragDisabled={
                              !isDragAndDropEnabled ||
                              !hasPermission(
                                user?.permissions || [],
                                "update",
                                "lesson"
                              )
                            }
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`w-full`}
                              >
                                <LessonItem
                                  key={lesson.id}
                                  lesson={lesson}
                                  moduleId={moduleId}
                                  selectedLesson={selectedLesson}
                                  onSelectLesson={onSelectLesson}
                                  onOpenModal={handleOpenLessonDeletionModal}
                                >
                                  {!isDragAndDropEnabled && children}
                                </LessonItem>
                              </div>
                            )}
                          </Draggable>
                        )
                    )
                  ) : (
                    <p>Aucune leçon</p>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </motion.div>
      </div>
    </>
  );
};

export default CourseItem;
