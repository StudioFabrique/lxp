import { useMemo } from "react";
import Course from "../../../../../src/utils/interfaces/course";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import TableActionsModal from "../../../../components/table/TableActionsModal";
import { ModalCourseType } from "./course-item";

type CourseActionsModalProps = {
  modalType?: ModalCourseType;
  showModal: boolean;
  isModalLoading: boolean;
  course: Course;
  lesson?: Lesson;
  onCancel: () => void;
  onConfirm: () => void;
};

const CourseActionsModal = ({
  showModal,
  isModalLoading,
  course,
  lesson,
  onCancel,
  onConfirm,
  modalType,
}: CourseActionsModalProps) => {
  const title = useMemo(() => {
    switch (modalType) {
      case "visibility":
        return "Visibilité";
      case "publish":
        return "Publier";
      case "deleteCourse":
        return "Supprimer le cours";
      case "deleteLesson":
        return "Supprimer la leçon";
      default:
        return "";
    }
  }, [modalType]);

  const description = useMemo(() => {
    switch (modalType) {
      case "visibility":
        return "Changez la visibilité du cours";
      case "publish":
        return "Publiquez le cours";
      case "deleteCourse":
        return "Supprimez le cours";
      case "deleteLesson":
        return "Supprimez la leçon";
      default:
        return "";
    }
  }, [modalType]);

  return (
    <TableActionsModal
      isOpen={showModal}
      onCancel={onCancel}
      title={title}
      description={description}
      descList={lesson ? [lesson.title] : [course.title]}
    >
      <button
        className={`btn btn-primary btn-md ${isModalLoading && "loading"}`}
        onClick={onConfirm}
      >
        Confirmer
      </button>
    </TableActionsModal>
  );
};

export default CourseActionsModal;
