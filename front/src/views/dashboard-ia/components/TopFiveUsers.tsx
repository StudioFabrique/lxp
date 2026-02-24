import { useState, useCallback, useEffect } from "react";
import SubWrapper from "../../../components/UI/sub-wrapper/sub-wrapper.component";
import useHttp from "../../../hooks/use-http";

type TopUser = {
  _id: string;
  name: string;
  totalTokens: number;
  //groupName: string | null;
};

export default function TopFiveUsers() {
  const { sendRequest } = useHttp();
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  const getTopUsers = useCallback(() => {
    const applyData = (data: TopUser[]) => {
      setTopUsers(data);
    };

    sendRequest({ path: "/dashboard-ia/top-five-users" }, applyData);
  }, [sendRequest]);

  useEffect(() => {
    getTopUsers();
  }, [getTopUsers]);

  return (
    <>
      {topUsers.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          Aucune donnée disponible
        </p>
      ) : (
        <ul className="flex flex-col gap-y-2">
          {topUsers.map((user: TopUser) => (
            <li key={user._id}>
              <SubWrapper>
                <span className="w-full grid grid-cols-2 text-xs">
                  <h3 className="w-32">{user.name}</h3>

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
