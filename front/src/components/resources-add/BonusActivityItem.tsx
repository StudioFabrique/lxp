import { BonusActivity } from "../../utils/interfaces/resource";
import { TextInitial } from "lucide-react";

type Props = {
  activity: BonusActivity;
};

export default function BonusActivityItem({ activity }: Props) {
  let icon: JSX.Element;

  console.log(activity.type);

  switch (activity.type) {
    case "text":
      icon = <TextInitial />;
      break;
    case "video":
      icon = <span>🎥</span>;
      break;
    case "fichier":
      icon = <span>📁</span>;
      break;
    case "image":
      icon = <span>🖼️</span>;
      break;
    default:
      icon = <span>❓</span>;
  }

  return (
    <div className="flex items-center gap-4">
      {icon}
      <h3>{activity.title}</h3>
    </div>
  );
}
