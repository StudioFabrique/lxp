import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import {
  observabilityApi,
  type ActivityUser,
  type DetailKind,
} from "../api/observability.api";
import { observabilityKeys } from "../api/observability.keys";
import type { ActivityRange } from "../helpers/activity-range";
import { scrollToElementTop } from "../helpers/scroll-to-element";
import ActiveUsersDetail from "./ActiveUsersDetail";
import { detailPanelId } from "../helpers/stat-blocks";
import ErrorsDetail from "./ErrorsDetail";
import FailedLoginsDetail from "./FailedLoginsDetail";
import LoginsDetail from "./LoginsDetail";
import PerformanceDetail from "./PerformanceDetail";
import RequestsDetail from "./RequestsDetail";

const titles: Record<DetailKind, string> = {
  logins: "Détail des connexions",
  "failed-logins": "Détail des échecs de connexion",
  "active-users": "Détail des utilisateurs actifs",
  requests: "Détail des requêtes",
  "client-errors": "Détail des erreurs côté client",
  "server-errors": "Détail des erreurs côté serveur",
  performance: "Détail des temps de réponse",
};

type Props = {
  kind: DetailKind;
  range: ActivityRange;
  /** Change à chaque ouverture d'un bloc, même si le détail affiché est le même. */
  scrollSignal: number;
  onClose: () => void;
  onSelectUser: (user: ActivityUser) => void;
};

export default function ActivityDetailPanel({
  kind,
  range,
  scrollSignal,
  onClose,
  onSelectUser,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Le détail s'ouvre sous les blocs : on amène son début à l'écran à chaque
  // ouverture. Le début (et non « le plus proche ») évite qu'un panneau déjà
  // à moitié visible, ou encore réduit à son squelette de chargement, ne
  // déclenche aucun défilement.
  useEffect(() => scrollToElementTop(panelRef.current), [scrollSignal]);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: observabilityKeys.details(kind, range),
    queryFn: () => observabilityApi.queries.getDetails(kind, range),
    retry: false,
  });

  return (
    <div ref={panelRef} className="scroll-mt-28">
      <BoxWrapper
        id={detailPanelId}
        className="mb-4"
        aria-label={titles[kind]}
        role="region"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{titles[kind]}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={onClose}
            aria-label="Fermer le détail"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {isPending ? (
          <LoadingSkeleton variant="rows" label="Chargement du détail" />
        ) : isError ? (
          <div role="alert" className="alert alert-error">
            <span>
              Impossible de charger le détail. Réessayez dans un instant.
            </span>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => refetch()}
            >
              Réessayer
            </button>
          </div>
        ) : data.kind === "logins" ? (
          <LoginsDetail data={data} onSelectUser={onSelectUser} />
        ) : data.kind === "failed-logins" ? (
          <FailedLoginsDetail data={data} />
        ) : data.kind === "active-users" ? (
          <ActiveUsersDetail data={data} onSelectUser={onSelectUser} />
        ) : data.kind === "requests" ? (
          <RequestsDetail data={data} />
        ) : data.kind === "performance" ? (
          <PerformanceDetail data={data} />
        ) : (
          <ErrorsDetail data={data} onSelectUser={onSelectUser} />
        )}
      </BoxWrapper>
    </div>
  );
}
