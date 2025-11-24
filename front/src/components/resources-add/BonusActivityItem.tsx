import { Dispatch, SetStateAction } from "react";
import BonusActivity from "../../utils/interfaces/resource";
import { EditIcon, TextInitial, Trash2, Video } from "lucide-react";

type Props = {
  disabled?: boolean;
  activity: BonusActivity;
  onDelete: Dispatch<SetStateAction<BonusActivity | null>>;
  onEdit: Dispatch<SetStateAction<BonusActivity | null>>;
  onPreview: (state: "read" | "edit" | "write") => void;
};

export default function BonusActivityItem({
  disabled = false,
  activity,
  onEdit,
  onDelete,
  onPreview,
}: Props) {
  let icon: JSX.Element;

  const iconStyle = "w-4 h-4 text-primary";

  switch (activity.type) {
    case "text":
      icon = <TextInitial className={iconStyle} />;
      break;
    case "video":
      icon = <Video className={iconStyle} />;
      break;
    case "fichier":
      icon = <span className={iconStyle}>📁</span>;
      break;
    case "image":
      icon = <span className={iconStyle}>🖼️</span>;
      break;
    default:
      icon = <span>❓</span>;
  }

  const style = "hover:cursor-pointer flex p-2 rounded-sm bg-secondary/10";

  return (
    <div className={"flex items-center gap-2 w-full"}>
      <div className={style}>{icon}</div>
      <button
        className={
          "text-xs text-primary flex-1 hover:cursor-pointer flex p-2 rounded-sm bg-secondary/10"
        }
        onClick={() => onPreview("read")}
      >
        {activity.title}
      </button>
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
    </div>
  );
}
