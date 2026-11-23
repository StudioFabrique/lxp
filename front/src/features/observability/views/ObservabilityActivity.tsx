import { useContext, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, ScrollText } from "lucide-react";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import { AuthContext } from "../../../store/AuthProvider";
import {
  observabilityApi,
  victoriaLogsUrl,
  type ActivityUser,
} from "../api/observability.api";
import { observabilityKeys } from "../api/observability.keys";
import { presetRange, type ActivityRange } from "../helpers/activity-range";
import { detailKindOfBlock, type StatBlockId } from "../helpers/stat-blocks";
import ActivityDetailPanel from "../components/ActivityDetailPanel";
import ActivityPeriodSelect from "../components/ActivityPeriodSelect";
import ActivityStats from "../components/ActivityStats";
import HourlyLoginsChart from "../components/HourlyLoginsChart";
import RecentLoginsTable from "../components/RecentLoginsTable";
import SlowRoutesTable from "../components/SlowRoutesTable";
import StatusBreakdown from "../components/StatusBreakdown";
import UserActivityDrawer from "../components/UserActivityDrawer";

export default function ObservabilityActivity() {
  const { user } = useContext(AuthContext);
  const isRoot = user?.roles?.[0]?.rank === 0;
  const [range, setRange] = useState<ActivityRange>(presetRange("24h"));
  const [selectedBlock, setSelectedBlock] = useState<StatBlockId | null>(null);
  const [scrollSignal, setScrollSignal] = useState(0);
  // Bloc qui a ouvert le détail : on y revient à la fermeture.
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<ActivityUser | null>(null);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: observabilityKeys.overview(range),
    queryFn: () => observabilityApi.queries.getOverview(range),
    enabled: isRoot,
    retry: false,
  });

  if (!isRoot) {
    return (
      <p role="alert">Vous n’avez pas accès aux journaux de l’instance.</p>
    );
  }

  // La fermeture est appliquée tout de suite : la page raccourcit d'un coup, et
  // sans repositionnement elle se recalerait vers le haut. On ramène donc le
  // bloc d'origine au centre de l'écran et on lui rend le focus.
  const closeDetail = () => {
    flushSync(() => setSelectedBlock(null));
    const opener = openerRef.current;
    opener?.scrollIntoView?.({ block: "center", behavior: "auto" });
    opener?.focus({ preventScroll: true });
  };

  // Un second clic sur le bloc ouvert referme le détail ; chaque ouverture
  // relance le défilement vers le panneau.
  const toggleBlock = (block: StatBlockId, button: HTMLButtonElement) => {
    openerRef.current = button;
    if (selectedBlock === block) {
      closeDetail();
      return;
    }
    setSelectedBlock(block);
    setScrollSignal((signal) => signal + 1);
  };

  return (
    <PageWrapper as="main">
      <Header
        title="Journaux de l'instance"
        description="Connexions, erreurs et performances de la plateforme"
        icon={ScrollText}
      >
        <a
          href={victoriaLogsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-primary"
        >
          <ExternalLink className="size-5" aria-hidden="true" />
          Consulter en détail
          <span className="sr-only">
            {" "}
            dans VictoriaLogs (s’ouvre dans un nouvel onglet)
          </span>
        </a>
      </Header>

      <ActivityPeriodSelect value={range} onChange={setRange} />

      {isPending ? (
        <LoadingSkeleton variant="cards" label="Chargement de l'activité" />
      ) : isError ? (
        <div role="alert" className="flex flex-col gap-5 items-center">
          <span>
            Impossible de charger l'activité. Vérifiez que le service de
            journaux est démarré.
          </span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => refetch()}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <>
          <ActivityStats
            totals={data.totals}
            selected={selectedBlock}
            onSelect={toggleBlock}
          />
          {selectedBlock && (
            <ActivityDetailPanel
              kind={detailKindOfBlock(selectedBlock)}
              range={range}
              scrollSignal={scrollSignal}
              onClose={closeDetail}
              onSelectUser={setSelectedUser}
            />
          )}
          <HourlyLoginsChart buckets={data.hourlyLogins} />
          <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
            <StatusBreakdown breakdown={data.statusBreakdown} />
            <SlowRoutesTable routes={data.slowestRoutes} />
          </div>
          <div className="mt-4">
            <RecentLoginsTable
              logins={data.recentLogins}
              onSelectUser={setSelectedUser}
            />
          </div>
        </>
      )}

      {selectedUser && (
        <UserActivityDrawer
          user={selectedUser}
          range={range}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </PageWrapper>
  );
}
