import { Plus } from "lucide-react";
import activityIconType from "../../../utils/activity-icon-type";
import { Activity } from "../../../utils/interfaces/activity";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import Can from "../../UI/can/can.component";

type ActivityListProps = {
  activities?: Activity[];
  selectedActivity?: Activity | null;
  newActivityButtonDisabled?: boolean;
  onSelectActivity: (activity: Activity) => void;
  onClickCreateActivity?: () => void;
};

export default function ActivityList({
  activities,
  selectedActivity,
  newActivityButtonDisabled,
  onSelectActivity,
  onClickCreateActivity,
}: ActivityListProps) {
  return (
    <FadeWrapper>
      <div className="pt-2 flex flex-col items-center gap-1 w-full">
        {activities?.length ? (
          activities?.map((activity) => (
            <button
              key={activity.id}
              onClick={() => onSelectActivity(activity)}
              className="btn btn-ghost justify-start text-start btn-sm w-full h-6"
            >
              {activityIconType(activity.type, 4)}
              <span
                className={`truncate max-w-[90%] ${
                  selectedActivity?.id === activity.id && "underline"
                }`}
              >
                {activity.title}
              </span>
            </button>
          ))
        ) : (
          <Can action="component" object="progression">
            <p className="text-primary text-sm">Aucune activité</p>
          </Can>
        )}
        {onClickCreateActivity && (
          <Can action="update" object="lesson">
            <span className="px-4 w-full">
              <button
                className="btn btn-outline btn-secondary hover:text-base-100 btn-sm h-fit text-[10px] mt-2 w-full"
                disabled={newActivityButtonDisabled}
                onClick={onClickCreateActivity}
              >
                <Plus className="w-4 h-6" />
                Ajouter une activité
              </button>
            </span>
          </Can>
        )}
      </div>
    </FadeWrapper>
  );
}
