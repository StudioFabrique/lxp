import Header from "../../components/UI/header";
import SubWrapper from "../../components/UI/sub-wrapper/sub-wrapper.component";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
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
        <article className="flex flex-col gap-y-2">
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
        <article className="bg-error">tata</article>
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
          <SubWrapper>
            <span className="w-full flex gap-x-4 items-center text-xs">
              <h3 className="w-32">{stat.groupName}</h3>
              <progress
                className="progress progress-primary flex-1"
                value={stat.totalTokens}
                max={props.groupsTotalTokens}
              ></progress>
              <p className="flex">{stat.totalTokens}</p>
              <p>
                (
                {((stat.totalTokens / props.groupsTotalTokens) * 100).toFixed(
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
}
