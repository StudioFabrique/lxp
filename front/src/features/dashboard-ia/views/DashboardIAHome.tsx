import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { AuthContext } from "../../../store/AuthProvider";
import { isTeacherUser } from "../../../utils/helpers/user-role";
import DropoutPreferencesForm from "../components/DropoutPreferencesForm";
import { dashboardIAApi } from "../api/dashboardIA.api";
import useTopUsers from "../hooks/useTopUsers";
import GroupsStats from "../components/GroupsStats";
import TopFiveUsers from "../components/TopFiveUsers";
import TopUsersTable from "../components/TopUsersTable";
import Header from "../../../../src/components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import BoxWrapper from "../../../../src/components/wrappers/BoxWrapper";
import ElementNotFound from "../../../components/UI/element-not-found";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";

const DashboardIAHome = () => {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: preferences } = useQuery({ queryKey: ["dropout-preferences"], queryFn: dashboardIAApi.queries.getDropoutPreferences, enabled: isTeacher });
  const { data: dropoutSummaries, isPending: summariesPending, isError: summariesError } = useQuery({ queryKey: ["dropout-summaries"], queryFn: dashboardIAApi.queries.getDropoutSummaries });
  const {
    dataList,
    totalPages,
    page,
    perPage,
    sortProperty,
    sortDirection,
    isLoading,
    isError: areTopUsersError,
    setPage,
    setPerPage,
    handleSort,
    handleSearch,
  } = useTopUsers();

  const { data: totals, error: totalsError } = useQuery({
    queryKey: ["dashboard-ia-total-tokens"],
    queryFn: dashboardIAApi.queries.getTotalTokens,
  });

  const { data: groupsStats, isPending: areGroupsStatsPending, isError: areGroupsStatsError } = useQuery({
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
    <PageWrapper as="main" className="min-h-screen items-center">
      <Header
        title="Tableau de bord IA"
        description="Consultez les statistiques de consommation de l'IA par vos apprenants"
      >
        {isTeacher && preferences?.hasParcours && <button className="btn btn-outline btn-sm" onClick={() => setSettingsOpen(true)}><Settings className="size-4" aria-hidden="true" /> Paramètres</button>}
      </Header>
      <section className="w-full">
        <h2 className="mb-4 pl-1 font-semibold">Analyse du décrochage par groupe</h2>
        <BoxWrapper className="h-auto">
          {summariesPending ? <LoadingSkeleton variant="rows" label="Chargement des analyses" />
            : summariesError ? <p role="alert">Impossible de charger les analyses.</p>
            : dropoutSummaries?.length ? <ul className="divide-y divide-base-300">
              {dropoutSummaries.map((group) => <li key={group.groupId} className="flex flex-wrap justify-between gap-2 py-3">
                <strong>{group.name}</strong><span>{group.analyzed} apprenants analysés · {group.critical} cas critiques · {new Date(group.completedAt).toLocaleDateString("fr-FR")}</span>
              </li>)}
            </ul> : <p>Aucun traitement terminé pour le moment.</p>}
        </BoxWrapper>
      </section>
      {settingsOpen && preferences && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Paramètres d'analyse du décrochage">
        <BoxWrapper className="h-auto w-full max-w-lg bg-base-100">
          <div className="flex justify-between"><h2 className="text-xl font-bold">Paramètres de l'analyse</h2><button aria-label="Fermer" onClick={() => setSettingsOpen(false)}>✕</button></div>
          <DropoutPreferencesForm initial={preferences} onSaved={() => setSettingsOpen(false)} />
        </BoxWrapper>
      </div>}
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
          <BoxWrapper>
            <div className="grid grid-cols-5 text-left text-primary">
              <p className="text-xs font-semibold col-span-2">Promotion</p>
              <p className="text-xs font-semibold col-span-2">Quantité</p>
              <p className="text-xs font-semibold ml-0">%</p>
            </div>
            {areGroupsStatsPending ? (
              <LoadingSkeleton variant="rows" label="Chargement des promotions" />
            ) : areGroupsStatsError ? (
              <p role="alert">Impossible de charger les promotions.</p>
            ) : groupsStats && groupsStats.length > 0 ? (
              <GroupsStats
                stats={groupsStats}
                groupsTotalTokens={groupsTotalTokens}
              />
            ) : (
              <ElementNotFound message="Aucune promotion active trouvée." />
            )}
          </BoxWrapper>
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
          <BoxWrapper>
            <div className="grid grid-cols-2 text-xs font-semibold text-primary">
              <p>Apprenant</p>
              <p>Quantité</p>
            </div>
            {isLoading ? (
              <LoadingSkeleton variant="rows" label="Chargement des utilisateurs" />
            ) : areTopUsersError ? (
              <p role="alert">Impossible de charger les utilisateurs.</p>
            ) : top5Users.length > 0 ? (
              <TopFiveUsers topUsers={top5Users} />
            ) : (
              <ElementNotFound message="Aucune donnée de disponible." />
            )}
          </BoxWrapper>
        </article>
      </section>
      <section className="w-full">
        <h2 className="font-semibold pl-1 mb-4">
          Consommation tous utilisateurs
        </h2>
        {isLoading ? (
          <LoadingSkeleton variant="rows" label="Chargement des consommations" />
        ) : areTopUsersError ? (
          <p role="alert">Impossible de charger les consommations.</p>
        ) : totalPages > 0 ? (
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
          <BoxWrapper>
            <ElementNotFound message="Aucune donnée de disponible." />
          </BoxWrapper>
        )}
      </section>
    </PageWrapper>
  );
};

export default DashboardIAHome;
