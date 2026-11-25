import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityOverview } from "../api/observability.api";
import { numberColumn, routeColumn } from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Row = WithId<ActivityOverview["slowestRoutes"][number]>;

const columns: ColumnDef<StockFeatures, Row>[] = [
  routeColumn((row) => row),
  numberColumn("avg", "Durée moyenne", (row) => row.avgMs, "ms", true),
  numberColumn("hits", "Appels", (row) => row.hits),
];

export default function SlowRoutesTable({ routes }: Readonly<{ routes: ActivityOverview["slowestRoutes"] }>) {
  return (
    <CollapsibleTable
      title="Routes les plus lentes"
      rows={withIds(routes, (route) => `${route.method} ${route.path}`)}
      columns={columns}
      emptyMessage="Aucune requête sur cette période."
      countLabel="Routes"
    />
  );
}
