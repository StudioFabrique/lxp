import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import { cn } from "../../../utils/cn";
import {
  observabilityApi,
  type ActivityUser,
  type SearchResult,
} from "../api/observability.api";
import { observabilityKeys } from "../api/observability.keys";
import type { ActivityRange } from "../helpers/activity-range";
import {
  dateTimeColumn,
  userActionsColumn,
  userColumn,
} from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import { formatNumber } from "../../../utils/helpers/format-number";
import CollapsibleTable from "./CollapsibleTable";
import RouteLabel from "./RouteLabel";
import { statusLabel } from "../helpers/status-labels";

type Row = WithId<SearchResult>;

type Props = {
  text: string;
  range: ActivityRange;
  onSelectUser: (user: ActivityUser) => void;
};

const levelClassName = (level: string) =>
  cn(
    "badge badge-sm mr-2",
    level === "error" && "badge-error",
    level === "warn" && "badge-warning",
    level !== "error" && level !== "warn" && "badge-ghost",
  );

/** Résultats d'une recherche texte : une ligne par entrée de journal. */
export default function ActivitySearchResults({
  text,
  range,
  onSelectUser,
}: Props) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: observabilityKeys.search(text, range),
    queryFn: () => observabilityApi.queries.search(text, range),
    retry: false,
  });

  const rows = useMemo(
    () => withIds(data ?? [], (result) => `${result.time}-${result.message}`),
    [data],
  );

  const columns = useMemo<ColumnDef<StockFeatures, Row>[]>(
    () => [
      dateTimeColumn((row) => row.time),
      {
        id: "event",
        header: "Événement",
        enableSorting: false,
        cell: ({ row }) => {
          const entry = row.original;
          return entry.method && entry.path ? (
            <div className="py-2">
              <RouteLabel
                method={entry.method}
                path={entry.path}
                targets={entry.targets}
              />
            </div>
          ) : (
            <span className="text-sm">
              {entry.level && (
                <span className={levelClassName(entry.level)}>
                  {entry.level}
                </span>
              )}
              <span className="break-words">{entry.message}</span>
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Code",
        enableSorting: false,
        cell: ({ row }) => {
          const { status } = row.original;
          if (status === null) return null;
          return (
            <span
              className={cn(
                "badge badge-sm",
                status >= 500 && "badge-error",
                status >= 400 && status < 500 && "badge-warning",
                status < 400 && "badge-ghost",
              )}
            >
              {status}
              <span className="sr-only"> {statusLabel(status)}</span>
            </span>
          );
        },
      },
      userColumn((row) => ({
        user: row.user,
        anonymous: row.anonymous,
        system: row.system,
      })),
      userActionsColumn((row) => row.user, onSelectUser),
    ],
    [onSelectUser],
  );

  if (isPending) {
    return <LoadingSkeleton variant="rows" label="Recherche en cours" />;
  }
  if (isError) {
    return (
      <div role="alert" className="alert alert-error">
        <span>La recherche a échoué. Réessayez dans un instant.</span>
        <button type="button" className="btn btn-sm" onClick={() => refetch()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <CollapsibleTable
        title={`Résultats pour « ${text} »`}
        rows={rows}
        columns={columns}
        emptyMessage="Aucune entrée de journal ne correspond à cette recherche sur la période."
        countLabel="Résultats"
        defaultOpen
      />
      {rows.length >= 100 && (
        <p className="text-xs text-base-content/70">
          Les {formatNumber(100)} entrées les plus récentes sont affichées :
          précisez la recherche ou réduisez la période.
        </p>
      )}
    </div>
  );
}
