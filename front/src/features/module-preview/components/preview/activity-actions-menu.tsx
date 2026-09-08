import { Edit, Trash2 } from "lucide-react";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { Activity } from "../../../../../src/utils/interfaces/activity";

type ActivityActionsMenuProps = {
  activity: Activity;
  onEditActivity: (activity: Activity) => void;
  onOpenDeleteModal: (activity: Activity) => void;
  disabled?: boolean;
  permissionSubject?: "lesson" | "resource";
};

const ActivityActionsMenu = ({
  activity,
  onEditActivity,
  onOpenDeleteModal,
  disabled = false,
  permissionSubject = "lesson",
}: ActivityActionsMenuProps) => {
  return (
    <div className="flex items-center gap-1">
      {["text", "iframe", "image", "video", "resource"].includes(
        activity.type,
      ) && (
        <PermissionGuard action="update" object={permissionSubject}>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square tooltip tooltip-bottom"
            data-tip="Modifier"
            aria-label="Modifier l’activité"
            onClick={() => onEditActivity(activity)}
            disabled={disabled}
          >
            <Edit className="w-4 h-4" />
          </button>
        </PermissionGuard>
      )}
      <PermissionGuard action="delete" object={permissionSubject}>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10 tooltip tooltip-bottom"
          data-tip="Supprimer"
          aria-label="Supprimer l’activité"
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
