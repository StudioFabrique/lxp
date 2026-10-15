import SubWrapper from "../../../../src/components/wrappers/SubBoxWrapper";
import type { GroupsStats as GroupsStatsType } from "../types";

type Props = {
  stats: GroupsStatsType[];
  groupsTotalTokens: number;
};

const GroupsStats = ({ stats, groupsTotalTokens }: Props) => (
  <ul className="flex flex-col gap-y-2">
    {stats.map((stat) => (
      <li key={stat._id}>
        <SubWrapper>
          <span className="grid w-full grid-cols-5 gap-2 text-xs">
            <h3 className="col-span-2 min-w-0 break-words">{stat.groupName}</h3>
            <div className="col-span-2 flex min-w-0 items-center gap-x-2 sm:gap-x-4">
              <progress
                className="progress progress-primary w-full min-w-0 sm:w-36"
                value={stat.totalTokens}
                max={groupsTotalTokens}
              />
              <p className="flex shrink-0">{stat.totalTokens}</p>
            </div>
            <p className="text-left">
              (
              {((stat.totalTokens / groupsTotalTokens) * 100).toFixed(
                2,
              )}
              %)
            </p>
          </span>
        </SubWrapper>
      </li>
    ))}
  </ul>
);

export default GroupsStats;
