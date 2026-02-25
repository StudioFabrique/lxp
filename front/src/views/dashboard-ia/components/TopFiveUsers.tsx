import { Link } from "react-router-dom";
import SubWrapper from "../../../components/UI/sub-wrapper/sub-wrapper.component";
import { TopUser } from "../hooks/useDashboardIA";

type Props = {
  topUsers: TopUser[];
};

export default function TopFiveUsers(props: Props) {
  return (
    <>
      {props.topUsers.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          Aucune donnée disponible
        </p>
      ) : (
        <ul className="flex flex-col gap-y-2">
          {props.topUsers.map((user: TopUser) => (
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
}
