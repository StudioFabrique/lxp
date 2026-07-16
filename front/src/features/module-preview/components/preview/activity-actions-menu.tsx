import { Edit, Trash2 } from "lucide-react";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { Activity } from "../../../../../src/utils/interfaces/activity";

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
    <div className="flex items-center gap-1">
      {["text", "iframe"].includes(activity.type) && (
        <PermissionGuard action="update" object="lesson">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square tooltip tooltip-bottom"
            data-tip="Modifier"
            onClick={() => onEditActivity(activity)}
            disabled={disabled}
          >
            <Edit className="w-4 h-4" />
          </button>
        </PermissionGuard>
      )}
      <PermissionGuard action="delete" object="lesson">
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10 tooltip tooltip-bottom"
          data-tip="Supprimer"
          onClick={() => onOpenDeleteModal(activity)}
          disabled={disabled}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </PermissionGuard>
    </div>
  );
};

export default ActivityActionsMenu;
