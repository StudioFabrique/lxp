import {
  Edit,
  Eye,
  EyeOff,
  MoreVertical,
  Trash,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import Course from "../../../../../src/utils/interfaces/course";
import { ModalCourseType } from "./course-item";

type CourseActionsProps = {
  course: Course;
  onOpenModal: (modalType: ModalCourseType, e: React.MouseEvent) => void;
  onEdit: (event: React.MouseEvent) => void;
  onClickMenu: (e: React.MouseEvent) => void;
};

const CourseActions = ({
  course,
  onOpenModal,
  onEdit,
  onClickMenu,
}: CourseActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickPublish = (e: React.MouseEvent) => {
    setIsOpen(false);
    onOpenModal("publish", e);
  };

  const handleClickVisibility = (e: React.MouseEvent) => {
    setIsOpen(false);
    onOpenModal("visibility", e);
  };

  const handleClickDelete = (e: React.MouseEvent) => {
    setIsOpen(false);
    onOpenModal("deleteCourse", e);
  };

  const handleClickEdit = (e: React.MouseEvent) => {
    setIsOpen(false);
    onEdit(e);
  };

  return (
    <div onClick={onClickMenu} className="select-none">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="flex cursor-pointer">
            <MoreVertical className="stroke-secondary-content w-7 h-7 hover:bg-primary/20 px-1 rounded-lg transition-colors" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="right"
            align="start"
            sideOffset={20}
            alignOffset={-12}
            className="menu z-[100] bg-base-300/80 text-base-content rounded-lg w-60 backdrop-blur-sm border border-primary/20"
          >
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

            {course.isPublished && (
              <PermissionGuard action="update" object="course">
                <button
                  onClick={handleClickVisibility}
                  className="cursor-default flex items-center w-full px-4 py-3 text-sm hover:bg-primary/20 transition-all first:rounded-t-lg"
                >
                  {course.visibility ? (
                    <EyeOff className="w-4 h-4 mr-3" />
                  ) : (
                    <Eye className="w-4 h-4 mr-3" />
                  )}
                  {course.visibility ? "Rendre invisible" : "Rendre visible"}
                </button>
              </PermissionGuard>
            )}

            <PermissionGuard action="update" object="course">
              <button
                type="button"
                onClick={handleClickEdit}
                className="cursor-default flex items-center px-4 py-3 text-sm hover:bg-primary/20 transition-all"
              >
                <Edit className="w-4 h-4 mr-3" />
                Modifier le cours
              </button>
            </PermissionGuard>

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
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default CourseActions;
