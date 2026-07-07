import type UsersStats from "../../../utils/interfaces/users-stats";

const UserStats = ({ stats }: { stats: UsersStats[] | null }) => {
  if (!stats) return null;
  return (
    <ul className="flex justify-center gap-4 w-full mb-4">
      {stats.map((item) => (
        <li
          key={item.stat}
          className="flex flex-1 items-center w-full md:w-1/2 lg:w-1/3 xl:w-1/5 2xl:w-1/5"
        >
          <span className="h-[7rem] flex font-bold text-primary justify-evenly items-center flex-1 bg-secondary/20 rounded-lg p-4">
            <p className="md:text:md lg:text-md xl:text-md">{item.stat}</p>
            <p className="text-5xl lg:text-6xl xl:text-6xl">{item.value}</p>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default UserStats;
