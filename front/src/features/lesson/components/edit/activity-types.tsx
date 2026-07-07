import type { Dispatch, SetStateAction } from "react";
import { getActivityTypes } from "../../../../../src.legacy/config/lessons-activity-types";
import type ActivityType from "../../../../../src.legacy/utils/interfaces/activity-type";
import Wrapper from "../../../../../src.legacy/components/UI/wrapper/wrapper.component";

type ActivityTypeProps = {
  onActivityType: Dispatch<SetStateAction<string>>;
};

const activityTypes: ActivityType[] = getActivityTypes();

export default function ActivityTypes({ onActivityType }: ActivityTypeProps) {
  return (
    <Wrapper>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {activityTypes.map((item) => (
          <li
            className="text-primary rounded-lg bg-secondary/20 hover:bg-primary hover:text-white hover:scale-105 transition duration-500 cursor-pointer"
            key={item.id!}
            onClick={() => {
              onActivityType(item.type);
            }}
          >
            <div className="tooltip tooltip-bottom" data-tip={item.tooltip}>
              <div className="p-6">
                <div className="w-10 h-10 flex flex-col justify-evenly items-center gap-y-1">
                  <span className="w-5 h-5">{item.icon}</span>
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
