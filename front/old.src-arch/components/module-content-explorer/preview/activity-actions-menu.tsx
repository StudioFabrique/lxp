import { Edit, MoreVertical, Trash2 } from "lucide-react";
import Can from "../../UI/can/can.component";
import { Activity } from "../../../utils/interfaces/activity";

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
  return (
    <Can action="update" object="lesson">
      <div className="dropdown dropdown-end">
        <button
          tabIndex={0}
          type="button"
          className="btn btn-ghost btn-sm hover:bg-base-200"
          disabled={disabled}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-lg shadow-lg min-w-[12rem] p-1 z-50"
        >
          {["text", "iframe"].includes(activity.type) && (
            <li>
              <button
                onClick={() => onEditActivity(activity)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => onOpenDeleteModal(activity)}
              className="text-red-600 hover:bg-red-100 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </li>
        </ul>
      </div>
    </Can>
  );
};

export default ActivityActionsMenu;
