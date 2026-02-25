import Header from "../../components/UI/header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import { GroupsStatsComponent } from "./components/GroupStatsComponent";
import PaginatedTopUsers from "./components/PaginatedTopUsers";
import TopFiveUsers from "./components/TopFiveUsers";
import useDashboardIA from "./hooks/useDashboardIA";

export default function DashboardIAHome() {
  const {
    totalTokens,
    groupsStats,
    groupsTotalTokens,
    totalCurrentMonthTokens,
    dataList,
    page,
    totalPages,
    perPage,
    setPerPage,
    setPage,
    top5Users,
    sortData,
    sdir,
    stype,
  } = useDashboardIA();

  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-y-8">
      <Header
        title="Tableau de bord IA"
        description="Consultez les statistiques de consommation de l'IA par vos apprenants."
      ></Header>
      <section className="flex justify-start gap-x-4 items-center w-full">
        <div className="border border-primary/50 rounded-lg p-4">
          <article className="flex gap-x-2 items-center">
            <h2 className="font-semibold">Tokens consommés</h2>
            <h3 className="text-lg font-bold text-primary">{totalTokens}</h3>
          </article>
        </div>
        <div className="border border-primary/50 rounded-lg p-4">
          <article className="flex gap-x-2 items-center">
            <h2 className="font-semibold">Tokens consommés ce mois-ci</h2>
            <h3 className="text-lg font-bold text-primary">
              {totalCurrentMonthTokens}
            </h3>
          </article>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <article className="flex flex-col gap-y-2 h-fit">
          <h2 className="font-semibold pl-1">
            Utilisation des tokens par promotions ce mois-ci
          </h2>
          <Wrapper>
            <div className="grid grid-cols-5 text-left text-primary">
              <p className="text-xs font-semibold col-span-2">Promotion</p>

              <p className="text-xs font-semibold col-span-2">Quantité</p>
              <p className="text-xs font-semibold ml-0">%</p>
            </div>
            <GroupsStatsComponent
              stats={groupsStats || []}
              groupsTotalTokens={groupsTotalTokens}
            />
          </Wrapper>
          <p className="text-xs text-justify w-11/12 mx-auto">
            * Attention, les pourcentages peuvent être approximatifs, par
            exemple si une promotion a été supprimée durant le mois en cours.
            Cependant le total, lui, reste précis.
          </p>
        </article>
        <article className="flex flex-col gap-y-2">
          <h2 className="font-semibold pl-1">
            Top consommateurs de tokens (5 premiers)
          </h2>
          <Wrapper>
            <div className="grid grid-cols-2 text-xs font-semibold text-primary">
              <p>Apprenant</p>
              <p>Quantité</p>
            </div>
            <TopFiveUsers topUsers={top5Users || []} />
          </Wrapper>
        </article>
      </section>
      <section className="w-full">
        {totalPages ? (
          <PaginatedTopUsers
            dataList={dataList}
            setPerPage={setPerPage}
            setPage={setPage}
            page={page}
            perPage={perPage}
            totalPages={totalPages}
            onSorting={sortData}
            sdir={sdir}
            stype={stype}
          />
        ) : null}
      </section>
    </main>
  );
}
