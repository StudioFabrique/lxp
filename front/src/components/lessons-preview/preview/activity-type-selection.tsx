import {
  File,
  Image,
  LucideProps,
  MonitorPlay,
  Text,
  Video,
} from "lucide-react";
import { ActivityType } from "../../../utils/interfaces/activity";

type Props = {
  onSelectType: (activityType: ActivityType) => void;
};

const activityTypes: {
  type: ActivityType;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}[] = [
  { type: "text", label: "texte", icon: Text },
  { type: "image", label: "image", icon: Image },
  { type: "video", label: "vidéo", icon: Video },
  { type: "iframe", label: "contenu interactif", icon: MonitorPlay },
  { type: "resource", label: "ressources", icon: File },
];

const ActivityTypeSelection = ({ onSelectType }: Props) => {
  return (
    <div className="flex flex-col items-center gap-10 mt-20 h-full">
      <span className="text-xl text-primary">
        Sélectionner un type d'activité
      </span>
      <div className="flex gap-5 items-center justify-center">
        {activityTypes.map((type) => (
          <button
            className="btn btn-primary flex flex-col items-center h-28 w-28 text-base-100 justify-center rounded-lg capitalize"
            onClick={() => onSelectType(type.type)}
          >
            <type.icon className="" /> {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityTypeSelection;
