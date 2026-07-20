import { EditIcon, Trash2 } from "lucide-react";
import { Activity } from "../../../../utils/interfaces/activity";
import activityIconType from "../../../../utils/helpers/activity-icon-type";
import PermissionGuard from "../../../../components/guards/PermissionGuard";

type Props = {
  disabled?: boolean;
  activity: Activity;
  onDelete: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onPreview: (activity: Activity | null) => void;
};

export default function BonusActivityItem({
  disabled = false,
  activity,
  onEdit,
  onDelete,
  onPreview,
}: Props) {
  const style = "hover:cursor-pointer flex p-2 rounded-sm bg-secondary/10";

  return (
    <div className={"flex items-center gap-2 w-full"}>
      <div
        className={style}
      >{activityIconType(activity.type)}</div>
      <button
        className={
          "text-xs text-primary flex-1 text-left hover:cursor-pointer truncate p-2 rounded-sm bg-secondary/10 tooltip tooltip-bottom"
        }
        data-tip="Cliquez pour prévisualiser l'activité."
        onClick={() => onPreview(activity)}
      >
        {activity.title}
      </button>
      <PermissionGuard action="write" object="lesson">
        <div
          className={
            "hover:cursor-pointer p-2 rounded-sm bg-secondary/10 flex items-center gap-2"
          }
        >
          <button
            className="cursor-pointer"
            disabled={disabled}
            title="Éditer l'activité"
            onClick={() => onEdit(activity)}
            aria-label="Éditer l'activité"
          >
            <EditIcon className="w-4 h-4 text-primary" />
          </button>
          <button
            className="cursor-pointer"
            disabled={disabled}
            onClick={() => onDelete(activity)}
            title="Supprimer l'activité"
            aria-label="Supprimer l'activité"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      </PermissionGuard>
    </div>
  );
}
