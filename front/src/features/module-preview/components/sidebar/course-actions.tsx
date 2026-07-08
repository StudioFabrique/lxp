import { Edit, ListPlus, MoreVertical, Trash, UploadCloud } from "lucide-react";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { Link } from "react-router";
import Course from "../../../../../src.legacy/utils/interfaces/course";
import { ModalCourseType } from "./course-item";

type CourseActionsProps = {
  course: Course;
  parcoursId?: number;
  moduleId?: number;
  onOpenModal: (modalType: ModalCourseType, e: React.MouseEvent) => void;
  onClickMenu: (e: React.MouseEvent) => void;
};

const CourseActions = ({
  course,
  parcoursId,
  moduleId,
  onOpenModal,
  onClickMenu,
}: CourseActionsProps) => {
  const handleClickPublish = (e: React.MouseEvent) => {
    onOpenModal("publish", e);
  };

  const handleClickDelete = (e: React.MouseEvent) => {
    onOpenModal("deleteCourse", e);
  };

  return (
    <div
      onClick={onClickMenu}
      className="dropdown dropdown-right z-9 select-none"
    >
      <button className="flex cursor-pointer">
        <MoreVertical className="stroke-secondary-content w-7 h-7 hover:bg-primary/20 px-1 rounded-lg transition-colors" />
      </button>

      <div className="dropdown-content menu translate-x-5 -translate-y-3 bg-base-300/80 text-base-content rounded-lg w-60 backdrop-blur-sm border border-primary/20">
        {!course.isPublished && (
          <PermissionGuard action="update" object="course">
            <button
              onClick={handleClickPublish}
              className="cursor-default flex items-center w-full px-4 py-3 text-sm hover:bg-primary/20 transition-all last:rounded-b-lg"
            >
              <UploadCloud className="w-4 h-4 mr-3" />
              <span>Publier le cours</span>
            </button>
          </PermissionGuard>
        )}

        <PermissionGuard action="update" object="course">
          <Link
            to={`/admin/course/edit/${course.id}`}
            className="cursor-default flex items-center px-4 py-3 text-sm hover:bg-primary/20 transition-all first:rounded-t-lg"
          >
            <Edit className="w-4 h-4 mr-3" />
            Modifier le cours
          </Link>
        </PermissionGuard>

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
          Créer une leçon
        </Link>

        {/* <PermissionGuard action="update" object="course">
          <button
            onClick={onClickChangeCourseOrder}
            className="cursor-default flex items-center px-4 py-3 text-sm hover:bg-primary/20 transition-all"
          >
            {isDragAndDropEnabled ? (
              <>
                <OctagonX />
                Arrêter le changement d'ordre
              </>
            ) : (
              <>
                <ArrowDownUpIcon className="w-4 h-4 mr-3" />
                Changer l'ordre
              </>
            )}
          </button>
        </PermissionGuard> */}

        <PermissionGuard action="delete" object="course">
          <button
            onClick={handleClickDelete}
            className="cursor-default flex items-center w-full px-4 py-3 text-sm text-error hover:bg-error/10 transition-all last:rounded-b-lg"
          >
            <Trash className="w-4 h-4 mr-3" />
            Supprimer le cours
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default CourseActions;
