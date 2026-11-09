import { LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import Course from "../../../../../src/utils/interfaces/course";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import TableActionsModal from "../../../../components/table/TableActionsModal";
import { ModalCourseType } from "./course-item";
import { formatTitle } from "../../../../utils/helpers/text-helpers";

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
    const courseName = `« ${formatTitle(course.title)} »`;
    const lessonName = `« ${formatTitle(lesson?.title)} »`;
    switch (modalType) {
      case "visibility":
        return `Vous allez changer la visibilité du cours ${courseName} auprès des apprenants.`;
      case "publish":
        return `Vous allez publier le cours ${courseName}. Les apprenants le verront aussitôt, selon sa visibilité.`;
      case "deleteCourse":
        return `Vous allez supprimer le cours ${courseName}. Cette action est irréversible.`;
      case "deleteLesson":
        return `Vous allez supprimer la leçon ${lessonName}. Cette action est irréversible.`;
      default:
        return "";
    }
  }, [course.title, lesson?.title, modalType]);

  return (
    <TableActionsModal
      isOpen={showModal}
      onCancel={onCancel}
      isPending={isModalLoading}
      title={title}
      description={description}
    >
      <button
        className="btn btn-primary btn-md"
        onClick={onConfirm}
        disabled={isModalLoading}
      >
        {isModalLoading && <LoaderCircle className="size-5 animate-spin" />}
        Confirmer
      </button>
    </TableActionsModal>
  );
};

export default CourseActionsModal;
