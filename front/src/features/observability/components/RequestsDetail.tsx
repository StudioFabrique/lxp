import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityDetails } from "../api/observability.api";
import { numberColumn, routeColumn } from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Data = Extract<ActivityDetails, { kind: "requests" }>;
type MethodRow = WithId<Data["byMethod"][number]>;
type RouteRow = WithId<Data["topRoutes"][number]>;

const methodColumns: ColumnDef<StockFeatures, MethodRow>[] = [
  {
    id: "method",
    header: "Méthode",
    enableSorting: false,
    cell: ({ row }) => <span className="badge badge-outline">{row.original.method}</span>,
  },
  numberColumn("count", "Requêtes", (row) => row.count, undefined, true),
];

const routeColumns: ColumnDef<StockFeatures, RouteRow>[] = [
  routeColumn((row) => row),
  numberColumn("hits", "Appels", (row) => row.hits, undefined, true),
  numberColumn("avg", "Durée moyenne", (row) => row.avgMs, "ms"),
];

export default function RequestsDetail({ data }: { data: Data }) {
  const none = "Aucune requête sur cette période.";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <div className="xl:col-span-2">
        <CollapsibleTable title="Répartition par méthode"
            rows={withIds(data.byMethod, (row) => row.method)}
            columns={methodColumns}
            emptyMessage={none}
            countLabel="Méthodes"
          nested defaultOpen />
      </div>
      <div className="xl:col-span-3">
        <CollapsibleTable title="Routes les plus appelées"
            rows={withIds(data.topRoutes, (row) => `${row.method} ${row.path}`)}
            columns={routeColumns}
            emptyMessage={none}
            countLabel="Routes"
          nested defaultOpen />
      </div>
    </div>
  );
}
