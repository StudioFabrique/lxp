import { FC } from "react";
import UsersStats from "../../../utils/interfaces/users-stats";

// Props type definition for the component
type Props = {
  stats: Array<UsersStats> | null;
};

/**
 * UsersListStats Component
 * Displays a grid of user statistics cards
 * Each card shows a stat label and its corresponding value
 * Responsive layout: 1 column on mobile, 2 on md, 3 on lg, and 5 on 2xl screens
 */
const UsersListStats: FC<Props> = ({ stats }) => {
  return (
    <ul className="flex flex-wrap justify-evenly items-center gap-4 w-full">
      {/* Render stats cards only if stats array is not null */}
      {stats
        ? stats.map((item: UsersStats) => (
            <li key={item.stat}>
              {/* Stat card with label and value */}
              <span className="w-[12rem] h-[12rem] flex flex-col font-bold text-primary justify-evenly items-center bg-secondary/20 rounded-lg p-4">
                <p className="md:text:md lg:text-md xl:text-md">{item.stat}</p>
                <p className="text-5xl lg:text-6xl xl:text-6xl">{item.value}</p>
              </span>
            </li>
          ))
        : null}
    </ul>
  );
};

export default UsersListStats;
