import Course from "../../../utils/interfaces/course";
import TableActionsModal from "../../table/table-buttons/table-actions-modal";

type CourseActionsModalProps = {
  title?: string;
  description?: string;
  showModal: boolean;
  isModalLoading: boolean;
  course: Course;
  onCancel: () => void;
  onConfirm: () => void;
};

const CourseActionsModal = ({
  title,
  description,
  showModal,
  isModalLoading,
  course,
  onCancel,
  onConfirm,
}: CourseActionsModalProps) => {
  return (
    <TableActionsModal
      isOpen={showModal}
      onCancel={onCancel}
      title={title}
      description={description}
      descList={[course.title]}
    >
      <button
        className={`btn btn-error btn-md text-warning ${isModalLoading && "loading"}`}
        onClick={onConfirm}
      >
        Confirmer
      </button>
    </TableActionsModal>
  );
};

export default CourseActionsModal;
