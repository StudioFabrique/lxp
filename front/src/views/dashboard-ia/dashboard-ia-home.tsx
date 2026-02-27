import { useEffect } from "react";
import Header from "../../components/UI/header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import { GroupsStatsComponent } from "./components/GroupStatsComponent";
import PaginatedTopUsers from "./components/PaginatedTopUsers";
import TopFiveUsers from "./components/TopFiveUsers";
import useDashboardIA from "./hooks/useDashboardIA";
import toast from "react-hot-toast";
import ElementNotFound from "../../components/UI/element-not-found";

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
    setPath,
    handleSearch,
    error,
  } = useDashboardIA();

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

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
            {groupsStats && groupsStats.length > 0 ? (
              <GroupsStatsComponent
                stats={groupsStats}
                groupsTotalTokens={groupsTotalTokens}
              />
            ) : (
              <ElementNotFound message="Aucune promotion active trouvée." />
            )}
          </Wrapper>
          {groupsStats && groupsStats.length > 0 ? (
            <p className="text-xs text-justify w-11/12 mx-auto">
              * Attention, les pourcentages peuvent être approximatifs, par
              exemple si une promotion a été supprimée durant le mois en cours.
              Cependant le total, lui, reste précis.
            </p>
          ) : null}
        </article>
        <article className="flex flex-col gap-y-2">
          <h2 className="font-semibold pl-1">
            Top consommateurs de tokens (5 premiers)
          </h2>

          <Wrapper>
            <div className="grid grid-cols-2 text-xs font-semibold text-primary">
              <p>Apprenant</p>
              <p>Quantité</p>
            </div>{" "}
            {top5Users && top5Users.length > 0 ? (
              <TopFiveUsers topUsers={top5Users} />
            ) : (
              <ElementNotFound message="Aucune donnée de disponible." />
            )}
          </Wrapper>
        </article>
      </section>
      <section className="w-full">
        <h2 className="font-semibold pl-1 mb-4">
          Consommation tous utilisateurs
        </h2>
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
            setPath={setPath}
            onSearchTerm={handleSearch}
          />
        ) : (
          <Wrapper>
            <ElementNotFound message="Aucune donnée de disponible." />
          </Wrapper>
        )}
      </section>
    </main>
  );
}
