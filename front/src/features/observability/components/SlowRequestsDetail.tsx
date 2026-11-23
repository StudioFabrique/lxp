import { useMemo } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityDetails, ActivityUser } from "../api/observability.api";
import {
  dateTimeColumn,
  numberColumn,
  routeColumn,
  userActionsColumn,
  userColumn,
} from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Data = Extract<ActivityDetails, { kind: "slow-requests" }>;
type RouteRow = WithId<Data["topRoutes"][number]>;
type EventRow = WithId<Data["recent"][number]>;

type Props = {
  data: Data;
  onSelectUser: (user: ActivityUser) => void;
};

const routeColumns: ColumnDef<StockFeatures, RouteRow>[] = [
  routeColumn((row) => row),
  numberColumn("count", "Requêtes lentes", (row) => row.count, undefined, true),
  numberColumn("avg", "Durée moyenne", (row) => row.avgMs, "ms"),
];

export default function SlowRequestsDetail({ data, onSelectUser }: Props) {
  const none = "Aucune requête lente sur cette période.";
  const routeRows = useMemo(
    () => withIds(data.topRoutes, (row) => `${row.method} ${row.path}`),
    [data.topRoutes],
  );
  const eventRows = useMemo(
    () => withIds(data.recent, (row) => row.time),
    [data.recent],
  );

  const eventColumns = useMemo<ColumnDef<StockFeatures, EventRow>[]>(
    () => [
      dateTimeColumn((row) => row.time),
      routeColumn((row) => row),
      numberColumn("duration", "Durée", (row) => row.durationMs, "ms", true),
      userColumn((row) => ({ user: row.user, anonymous: row.userId === null })),
      userActionsColumn((row) => row.user, onSelectUser),
    ],
    [onSelectUser],
  );

  return (
    <div className="flex flex-col gap-6">
      <CollapsibleTable
        title="Routes concernées"
        rows={routeRows}
        columns={routeColumns}
        emptyMessage={none}
        countLabel="Routes"
        nested
        defaultOpen
      />
      <CollapsibleTable
        title="Dernières requêtes lentes"
        rows={eventRows}
        columns={eventColumns}
        emptyMessage={none}
        countLabel="Requêtes"
        nested
        defaultOpen
      />
    </div>
  );
}
