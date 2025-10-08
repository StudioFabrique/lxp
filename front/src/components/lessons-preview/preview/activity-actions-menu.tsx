import { Edit, MoreVertical, Trash2 } from "lucide-react";
import Can from "../../UI/can/can.component";
import { Activity } from "../../../utils/interfaces/activity";
import { useState } from "react";

type ActivityActionsMenuProps = {
  activity: Activity;
  onEditActivity: (activity: Activity) => void;
  onOpenDeleteModal: (activity: Activity) => void;
  disabled?: boolean;
};

const ActivityActionsMenu = ({
  activity,
  onEditActivity,
  onOpenDeleteModal,
  disabled = false,
}: ActivityActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <Can action="update" object="lesson">
      <div>
        <button
          type="button"
          className="btn btn-ghost btn-sm hover:bg-base-200"
          onClick={handleClick}
          disabled={disabled}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0" onClick={handleClick} />
            <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[12rem] py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Edit clicked!");
                  setIsOpen(false);
                  onEditActivity(activity);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Delete clicked!");
                  setIsOpen(false);
                  onOpenDeleteModal(activity);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-100 text-red-600 w-full text-left"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Can>
  );
};

export default ActivityActionsMenu;
