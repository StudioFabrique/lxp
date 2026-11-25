import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { Settings, Sparkles } from "lucide-react";
import { AuthContext } from "../../../store/AuthProvider";
import { isTeacherUser } from "../../../utils/helpers/user-role";
import DropoutPreferencesForm from "../components/DropoutPreferencesForm";
import { dashboardIAApi } from "../api/dashboardIA.api";
import useTopUsers from "../hooks/useTopUsers";
import GroupsStats from "../components/GroupsStats";
import TopFiveUsers from "../components/TopFiveUsers";
import TopUsersTable from "../components/TopUsersTable";
import TokenStatBlock from "../components/TokenStatBlock";
import DropoutSummariesTable from "../components/DropoutSummariesTable";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import { useRoleLabels } from "../../role/hooks/useRoleLabels";

const DashboardIAHome = () => {
  const { labels } = useRoleLabels();
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: preferences } = useQuery({ queryKey: ["dropout-preferences"], queryFn: dashboardIAApi.queries.getDropoutPreferences, enabled: isTeacher });
  const { data: dropoutSummaries, isPending: summariesPending, isError: summariesError } = useQuery({ queryKey: ["dropout-summaries"], queryFn: dashboardIAApi.queries.getDropoutSummaries });
  const {
    dataList,
    totalItems,
    totalPages,
    page,
    perPage,
    sortProperty,
    sortDirection,
    isLoading: areTopUsersLoading,
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

  const { data: topConsumers, isPending: areTopConsumersPending, isError: areTopConsumersError } = useQuery({
    queryKey: ["dashboard-ia-top-consumers"],
    queryFn: () => dashboardIAApi.queries.getTopUsers({ sortProperty: "totalTokens", sortDirection: "desc", page: 1, limit: 20 }),
  });

  useEffect(() => {
    if (totalsError) toast.error(String(totalsError));
  }, [totalsError]);

  const groupsTotalTokens =
    groupsStats?.reduce((acc, g) => acc + g.totalTokens, 0) ?? 0;

  // Classement indépendant du tableau paginé : toujours les plus gros consommateurs.
  // La lecture porte sur plus de 5 lignes car les membres de l'équipe sont écartés.
  const top5Users = (topConsumers?.list ?? []).filter((u) => u.role === "student").slice(0, 5);

  return (
    <PageWrapper as="main">
      <Header
        title="Tableau de bord IA"
        description="Consultez les statistiques de consommation de l'IA par vos apprenants"
        icon={Sparkles}
      >
        {isTeacher && preferences?.hasParcours && <button className="btn btn-outline btn-primary" onClick={() => setSettingsOpen(true)}><Settings className="size-5" aria-hidden="true" /> Paramètres</button>}
      </Header>
      {settingsOpen && preferences && <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/50 p-4" role="dialog" aria-modal="true" aria-label="Paramètres d'analyse du décrochage">
        <BoxWrapper className="h-auto w-full max-w-lg bg-base-100">
          <div className="flex justify-between"><h2 className="text-xl font-bold">Paramètres de l'analyse</h2><button aria-label="Fermer" onClick={() => setSettingsOpen(false)}>✕</button></div>
          <DropoutPreferencesForm initial={preferences} onSaved={() => setSettingsOpen(false)} />
        </BoxWrapper>
      </div>}

      <ul aria-label="Chiffres clés" className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <li>
          <TokenStatBlock label="Tokens consommés" hint="Depuis le début" value={totals?.totalTokens ?? 0} />
        </li>
        <li>
          <TokenStatBlock label="Tokens consommés ce mois-ci" hint="Mois en cours" value={totals?.totalCurrentMonthTokens ?? 0} />
        </li>
      </ul>

      <BoxWrapper className="mb-4 h-auto">
        <h2 className="text-lg font-bold">Analyse du décrochage par groupe</h2>
        {summariesPending ? <LoadingSkeleton variant="rows" label="Chargement des analyses" />
          : summariesError ? <p role="alert">Impossible de charger les analyses.</p>
          : dropoutSummaries?.length ? <DropoutSummariesTable summaries={dropoutSummaries} />
          : <p className="text-base-content/70">Aucun traitement terminé pour le moment.</p>}
      </BoxWrapper>

      <div className="mb-4 grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <BoxWrapper>
          <h2 className="text-lg font-bold">Utilisation des tokens par promotions ce mois-ci</h2>
          {areGroupsStatsPending ? (
            <LoadingSkeleton variant="rows" label="Chargement des promotions" />
          ) : areGroupsStatsError ? (
            <p role="alert">Impossible de charger les promotions.</p>
          ) : groupsStats && groupsStats.length > 0 ? (
            <>
              <GroupsStats stats={groupsStats} groupsTotalTokens={groupsTotalTokens} />
              <p className="text-xs text-base-content/70">
                Attention, les pourcentages peuvent être approximatifs, par
                exemple si une promotion a été supprimée durant le mois en cours.
                Cependant le total, lui, reste précis.
              </p>
            </>
          ) : (
            <p className="text-base-content/70">Aucune promotion active trouvée.</p>
          )}
        </BoxWrapper>
        <BoxWrapper>
          <h2 className="text-lg font-bold">Top consommateurs de tokens (5 premiers)</h2>
          {areTopConsumersPending ? (
            <LoadingSkeleton variant="rows" label="Chargement des utilisateurs" />
          ) : areTopConsumersError ? (
            <p role="alert">Impossible de charger les utilisateurs.</p>
          ) : top5Users.length > 0 ? (
            <TopFiveUsers topUsers={top5Users} userLabel={labels[3]} />
          ) : (
            <p className="text-base-content/70">Aucune donnée de disponible.</p>
          )}
        </BoxWrapper>
      </div>

      <section aria-labelledby="dashboard-ia-all-users" className="w-full">
        <h2 id="dashboard-ia-all-users" className="sr-only">Consommation tous utilisateurs</h2>
        <TopUsersTable
          dataList={dataList}
          totalItems={totalItems}
          isLoading={areTopUsersLoading}
          isError={areTopUsersError}
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
      </section>
    </PageWrapper>
  );
};

export default DashboardIAHome;
