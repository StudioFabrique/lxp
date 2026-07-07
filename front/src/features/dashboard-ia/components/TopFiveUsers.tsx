import { Link } from "react-router";
import SubWrapper from "../../../../src.legacy/components/UI/sub-wrapper/sub-wrapper.component";
import type { TopUser } from "../types";

type Props = {
  topUsers: TopUser[];
};

const TopFiveUsers = ({ topUsers }: Props) => (
  <>
    {topUsers.length === 0 ? (
      <p className="text-center text-sm text-gray-500">
        Aucune donnée disponible
      </p>
    ) : (
      <ul className="flex flex-col gap-y-2">
        {topUsers.map((user) => (
          <li key={user._id}>
            <SubWrapper>
              <span className="w-full grid grid-cols-2 text-xs">
                <Link
                  to={`/admin/teacher/student/${user._id}`}
                  className="w-32"
                >
                  {user.name}
                </Link>
                <p>{user.totalTokens}</p>
              </span>
            </SubWrapper>
          </li>
        ))}
      </ul>
    )}
  </>
);

export default TopFiveUsers;
