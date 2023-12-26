import { getActivityTypes } from "../../config/lessons-activity-types";
import ActivityType from "../../utils/interfaces/activity-type";
import Wrapper from "../UI/wrapper/wrapper.component";

interface ActivityTypeProps {
  onActivityType: (activityType: string) => void;
}

const activityTypes: ActivityType[] = getActivityTypes();

export default function ActivityTypes({ onActivityType }: ActivityTypeProps) {
  return (
    <Wrapper>
      <ul className="flex items-center gap-x-4">
        {activityTypes.map((item) => (
          <li
            className="text-primary rounded-lg bg-secondary/20 hover:bg-primary hover:text-white cursor-pointer"
            key={item.id!}
            onClick={() => {
              onActivityType(item.type);
            }}
          >
            <div className="tooltip tooltip-bottom" data-tip={item.tooltip}>
              <div className="p-5">
                <div className="w-10 h-10 flex flex-col justify-evenly items-center gap-y-1">
                  <span className="w-6 h-6">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
}
