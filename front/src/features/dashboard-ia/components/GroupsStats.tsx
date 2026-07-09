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
          <span className="w-ful grid grid-cols-5 text-xs gap-2">
            <h3 className="w-32 col-span-2">{stat.groupName}</h3>
            <div className="flex items-center gap-x-4 col-span-2">
              <progress
                className="progress progress-primary w-36"
                value={stat.totalTokens}
                max={groupsTotalTokens}
              />
              <p className="flex">{stat.totalTokens}</p>
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
