import { Dispatch, SetStateAction } from "react";
import { BonusActivity } from "../../utils/interfaces/resource";
import { EditIcon, TextInitial, Trash2, Video } from "lucide-react";

type Props = {
  activity: BonusActivity;
  onDelete: Dispatch<SetStateAction<BonusActivity | null>>;
};

export default function BonusActivityItem({ activity, onDelete }: Props) {
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

  const style = "flex p-2 rounded-sm bg-secondary/10";

  return (
    <div className={"flex items-center gap-2 w-full"}>
      <div className={style}>{icon}</div>
      <h3 className={"text-xs text-primary flex-1 " + style}>
        {activity.title}
      </h3>
      <div className={style + " flex items-center gap-2"}>
        <EditIcon className="w-4 h-4 text-primary" />
        <button
          className="cursor-pointer"
          onClick={() => onDelete(activity)}
          title="Supprimer l'activité"
        >
          <Trash2 className="w-4 h-4 text-error" />
        </button>
      </div>
    </div>
  );
}
