import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { dashboardIAApi } from "../api/dashboardIA.api";
import useTopUsers from "../hooks/useTopUsers";
import GroupsStats from "../components/GroupsStats";
import TopFiveUsers from "../components/TopFiveUsers";
import TopUsersTable from "../components/TopUsersTable";
import Header from "../../../../src.legacy/components/UI/header";
import Wrapper from "../../../../src.legacy/components/UI/wrapper/wrapper.component";
import ElementNotFound from "../../../../src.legacy/components/UI/element-not-found";

const DashboardIAHome = () => {
  const {
    dataList,
    totalItems,
    totalPages,
    page,
    perPage,
    sortProperty,
    sortDirection,
    isLoading,
    setPage,
    setPerPage,
    handleSort,
    handleSearch,
  } = useTopUsers();

  const { data: totals, error: totalsError } = useQuery({
    queryKey: ["dashboard-ia-total-tokens"],
    queryFn: dashboardIAApi.queries.getTotalTokens,
  });

  const { data: groupsStats } = useQuery({
    queryKey: ["dashboard-ia-groups-stats"],
    queryFn: dashboardIAApi.queries.getGroupsStats,
  });

  useEffect(() => {
    if (totalsError) toast.error(String(totalsError));
  }, [totalsError]);

  const groupsTotalTokens =
    groupsStats?.reduce((acc, g) => acc + g.totalTokens, 0) ?? 0;

  const top5Users = !isLoading
    ? dataList.filter((u) => u.role === "student").slice(0, 5)
    : [];

  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-y-8">
      <Header
        title="Tableau de bord IA"
        description="Consultez les statistiques de consommation de l'IA par vos apprenants."
      />
      <section className="flex justify-start gap-x-4 items-center w-full">
        <div className="border border-primary/50 rounded-lg p-4">
          <article className="flex gap-x-2 items-center">
            <h2 className="font-semibold">Tokens consommés</h2>
            <h3 className="text-lg font-bold text-primary">
              {totals?.totalTokens ?? 0}
            </h3>
          </article>
        </div>
        <div className="border border-primary/50 rounded-lg p-4">
          <article className="flex gap-x-2 items-center">
            <h2 className="font-semibold">Tokens consommés ce mois-ci</h2>
            <h3 className="text-lg font-bold text-primary">
              {totals?.totalCurrentMonthTokens ?? 0}
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
              <GroupsStats
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
            </div>
            {top5Users.length > 0 ? (
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
        {totalPages > 0 || isLoading ? (
          <TopUsersTable
            dataList={dataList}
            setPerPage={setPerPage}
            setPage={setPage}
            page={page}
            perPage={perPage}
            totalPages={totalPages}
            onSort={handleSort}
            sortProperty={sortProperty}
            sortDirection={sortDirection}
            onSearch={handleSearch}
          />
        ) : (
          <Wrapper>
            <ElementNotFound message="Aucune donnée de disponible." />
          </Wrapper>
        )}
      </section>
    </main>
  );
};

export default DashboardIAHome;
