import { useMemo } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { cn } from "../../../utils/cn";
import type { ActivityDetails, ActivityUser } from "../api/observability.api";
import {
  dateTimeColumn,
  numberColumn,
  routeColumn,
  userActionsColumn,
  userColumn,
} from "../helpers/activity-columns";
import { statusLabel } from "../helpers/status-labels";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Data = Extract<ActivityDetails, { kind: "client-errors" | "server-errors" }>;
type StatusRow = WithId<Data["byStatus"][number]>;
type RouteRow = WithId<Data["topRoutes"][number]>;
type EventRow = WithId<Data["recent"][number]>;

type Props = {
  data: Data;
  onSelectUser: (user: ActivityUser) => void;
};

function StatusBadge({ status, isServer }: { status: string | number; isServer: boolean }) {
  return (
    <span className={cn("badge badge-sm", isServer ? "badge-error" : "badge-warning")}>
      {status}
      <span className="sr-only"> {statusLabel(status)}</span>
    </span>
  );
}

export default function ErrorsDetail({ data, onSelectUser }: Props) {
  const isServer = data.kind === "server-errors";
  const none = "Aucune erreur sur cette période.";

  const statusRows = useMemo(() => withIds(data.byStatus, (row) => row.status), [data.byStatus]);
  const routeRows = useMemo(
    () => withIds(data.topRoutes, (row) => `${row.method} ${row.path} ${row.status}`),
    [data.topRoutes],
  );
  const eventRows = useMemo(() => withIds(data.recent, (row) => row.time), [data.recent]);

  const statusColumns = useMemo<ColumnDef<StockFeatures, StatusRow>[]>(
    () => [
      {
        id: "code",
        header: "Code",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-2 text-sm">
            <StatusBadge status={row.original.status} isServer={isServer} />
            {statusLabel(row.original.status)}
          </span>
        ),
      },
      numberColumn("count", "Occurrences", (row) => row.count, undefined, true),
    ],
    [isServer],
  );
  const routeColumns = useMemo<ColumnDef<StockFeatures, RouteRow>[]>(
    () => [
      routeColumn((row) => row),
      {
        id: "status",
        header: "Code",
        enableSorting: false,
        cell: ({ row }) => <StatusBadge status={row.original.status} isServer={isServer} />,
      },
      numberColumn("count", "Occurrences", (row) => row.count, undefined, true),
    ],
    [isServer],
  );
  const eventColumns = useMemo<ColumnDef<StockFeatures, EventRow>[]>(
    () => [
      dateTimeColumn((row) => row.time),
      routeColumn((row) => row),
      {
        id: "status",
        header: "Code",
        enableSorting: false,
        cell: ({ row }) => <StatusBadge status={row.original.status} isServer={isServer} />,
      },
      userColumn((row) => ({ user: row.user, anonymous: row.userId === null })),
      numberColumn("duration", "Durée", (row) => row.durationMs, "ms"),
      userActionsColumn((row) => row.user, onSelectUser),
    ],
    [isServer, onSelectUser],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <CollapsibleTable title="Par code" rows={statusRows} columns={statusColumns} emptyMessage={none} countLabel="Codes" nested defaultOpen />
        </div>
        <div className="xl:col-span-3">
          <CollapsibleTable title="Routes concernées" rows={routeRows} columns={routeColumns} emptyMessage={none} countLabel="Routes" nested defaultOpen />
        </div>
      </div>
      <CollapsibleTable title="Derniers événements" rows={eventRows} columns={eventColumns} emptyMessage={none} countLabel="Événements" nested defaultOpen />
    </div>
  );
}
