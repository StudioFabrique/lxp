import { Plus } from "lucide-react";
import activityIconType from "../../../utils/activity-icon-type";
import { Activity } from "../../../utils/interfaces/activity";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import Can from "../../UI/can/can.component";

type ActivityListProps = {
  activities?: Activity[];
  selectedActivityId?: number | null;
  onSelectActivity: (activityId: number) => void;
};

export default function ActivityList({
  activities,
  selectedActivityId,
  onSelectActivity,
}: ActivityListProps) {
  return (
    <FadeWrapper>
      <div className="pl-4 pt-2 flex flex-col items-center gap-2 w-full">
        {activities?.map((activity) => (
          <button
            key={activity.id}
            onClick={() => onSelectActivity(activity.id)}
            className={`btn ${
              selectedActivityId === activity.id ? "btn-block" : "btn-ghost"
            } justify-start text-start btn-sm w-full h-8`}
          >
            {activityIconType(activity.type, 4)}
            <span className="truncate max-w-[140px] block">
              {activity.title}
            </span>
          </button>
        ))}
        <Can action="update" object="lesson">
          <button className="btn btn-outline btn-sm h-fit text-[10px] self-end justify-end w-fit">
            <Plus className="w-4 h-6" />
            Ajouter une activité
          </button>
        </Can>
      </div>
    </FadeWrapper>
  );
}
