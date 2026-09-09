import type UsersStats from "../../interfaces/users-stats";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";

const UserStats = ({ stats }: { stats: UsersStats[] | null }) => {
  if (!stats) return null;
  return (
    <ul className="mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <li key={item.stat}>
          <BoxWrapper
            className="h-28 flex-row items-center justify-between gap-4 p-4 font-bold text-primary"
          >
            <p className="text-base">{item.stat}</p>
            <p className="shrink-0 text-5xl lg:text-6xl">{item.value}</p>
          </BoxWrapper>
        </li>
      ))}
    </ul>
  );
};

export default UserStats;
