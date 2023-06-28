import { FC } from "react";

import UsersStats from "../../../utils/interfaces/users-stats";

type Props = {
  stats: Array<UsersStats> | null;
  isLoading: boolean;
};

const UsersListStats: FC<Props> = ({ stats, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <span className="loading loading-bars loading-lg text(primary"></span>
      ) : stats !== null && stats.length > 0 ? (
        <ul className="w-4/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-8">
          {stats.map((item: UsersStats) => (
            <li key={item.stat}>
              <span className="w-[12rem] h-[12rem] flex flex-col font-bold text-primary justify-evenly items-center bg-secondary/20 rounded-lg p-4">
                <p className="md:text:md lg:text-md xl:text-md">{item.stat}</p>
                <p className="text-5xl lg:text-6xl xl:text-6xl">{item.value}</p>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default UsersListStats;
