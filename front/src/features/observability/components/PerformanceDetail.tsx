import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityDetails } from "../api/observability.api";
import { numberColumn, routeColumn } from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Data = Extract<ActivityDetails, { kind: "performance" }>;
type Row = WithId<Data["slowestRoutes"][number]>;

const columns: ColumnDef<StockFeatures, Row>[] = [
  routeColumn((row) => row),
  numberColumn("avg", "Moyenne", (row) => row.avgMs, "ms", true),
  numberColumn("p95", "95e centile", (row) => row.p95Ms, "ms"),
  numberColumn("hits", "Appels", (row) => row.hits),
];

export default function PerformanceDetail({ data }: { data: Data }) {
  return (
    <CollapsibleTable title="Routes les plus lentes (durée moyenne)"
        rows={withIds(data.slowestRoutes, (row) => `${row.method} ${row.path}`)}
        columns={columns}
        emptyMessage="Aucune requête sur cette période."
        countLabel="Routes"
      nested defaultOpen />
  );
}
