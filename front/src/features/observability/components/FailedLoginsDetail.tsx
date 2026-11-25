import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityDetails } from "../api/observability.api";
import { dateTimeColumn, numberColumn, textColumn } from "../helpers/activity-columns";
import { statusLabel } from "../helpers/status-labels";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Data = Extract<ActivityDetails, { kind: "failed-logins" }>;
type IpRow = WithId<Data["byIp"][number]>;
type RecentRow = WithId<Data["recent"][number]>;

const ipColumns: ColumnDef<StockFeatures, IpRow>[] = [
  textColumn("ip", "Adresse IP", (row) => row.from, "font-mono text-xs"),
  numberColumn("count", "Échecs", (row) => row.count, undefined, true),
  dateTimeColumn((row) => row.last, "last", "Dernier essai"),
];

const recentColumns: ColumnDef<StockFeatures, RecentRow>[] = [
  dateTimeColumn((row) => row.time),
  textColumn("ip", "Adresse IP", (row) => row.from, "font-mono text-xs"),
  textColumn("reason", "Motif", (row) => statusLabel(row.status)),
];

export default function FailedLoginsDetail({ data }: Readonly<{ data: Data }>) {
  const none = "Aucun échec de connexion sur cette période.";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <CollapsibleTable title="Adresses IP les plus actives"
          rows={withIds(data.byIp, (row) => row.from)}
          columns={ipColumns}
          emptyMessage={none}
          countLabel="Adresses"
        nested defaultOpen />
      <CollapsibleTable title="Derniers échecs"
          rows={withIds(data.recent, (row) => row.time)}
          columns={recentColumns}
          emptyMessage={none}
          countLabel="Échecs"
        nested defaultOpen />
    </div>
  );
}
