import { useCallback, useEffect, useState } from "react";
import Header from "../../components/UI/header";
import SubWrapper from "../../components/UI/sub-wrapper/sub-wrapper.component";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import useHttp from "../../hooks/use-http";
import useDashboardIA, { GroupsStats } from "./hooks/useDashboardIA";

export default function DashboardIAHome() {
  const { totalTokens, groupsStats, groupsTotalTokens } = useDashboardIA();

  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-y-8">
      <Header
        title="Tableau de bord IA"
        description="Consultez les statistiques de consommation de l'IA par vos apprenants."
      ></Header>
      <section className="flex justify-start w-full">
        <div className="border border-primary/50 rounded-lg p-4">
          <article className="flex gap-x-2 items-center">
            <h2 className="font-semibold">Tokens consommés</h2>
            <h3 className="text-lg font-bold text-primary">{totalTokens}</h3>
          </article>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <article className="flex flex-col gap-y-2 h-fit">
          <h2 className="font-semibold pl-1">
            Utilisation des tokens par promotions
          </h2>
          <Wrapper>
            <GroupsStatsComponent
              stats={groupsStats || []}
              groupsTotalTokens={groupsTotalTokens}
            />
          </Wrapper>
        </article>
        <article className="flex flex-col gap-y-2">
          <h2 className="font-semibold pl-1">
            Top consommateurs de tokens (5 premiers)
          </h2>
          <Wrapper>
            <TopFiveUsersComponent />
          </Wrapper>
        </article>
      </section>
    </main>
  );
}

type Props = {
  stats: GroupsStats[];
  groupsTotalTokens: number;
};

export function GroupsStatsComponent(props: Props) {
  console.log(props.groupsTotalTokens);

  return (
    <ul className="flex flex-col gap-y-2">
      {props.stats.map((stat) => (
        <li key={stat._id}>
          <ProgressWrapper
            name={stat.groupName || "Inconnu"}
            value={stat.totalTokens}
            max={props.groupsTotalTokens}
          />
        </li>
      ))}
    </ul>
  );
}

type TopUser = {
  _id: string;
  name: string;
  totalTokens: number;
  //groupName: string | null;
};

export function TopFiveUsersComponent() {
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
                <span className="w-full flex gap-x-4 items-center text-xs">
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

export function ProgressWrapper(props: {
  name: string;
  value: number;
  max: number;
}) {
  return (
    <SubWrapper>
      <span className="w-full flex gap-x-4 items-center text-xs">
        <h3 className="w-32">{props.name}</h3>
        <p className="flex">{props.value}</p>
        <p>
          ({((props.value / props.max) * 100).toFixed(2)}
          %)
        </p>
      </span>
    </SubWrapper>
  );
}
