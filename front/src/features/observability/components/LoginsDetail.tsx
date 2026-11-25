import { useMemo } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityDetails, ActivityUser } from "../api/observability.api";
import {
  dateTimeColumn,
  numberColumn,
  textColumn,
  userActionsColumn,
  userColumn,
} from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Data = Extract<ActivityDetails, { kind: "logins" }>;
type TopRow = WithId<Data["topUsers"][number]>;
type RecentRow = WithId<Data["recent"][number]>;

type Props = {
  data: Data;
  onSelectUser: (user: ActivityUser) => void;
};

export default function LoginsDetail({ data, onSelectUser }: Readonly<Props>) {
  const topRows = useMemo(() => withIds(data.topUsers, (row) => row.userId), [data.topUsers]);
  const recentRows = useMemo(() => withIds(data.recent, (row) => row.time), [data.recent]);

  const topColumns = useMemo<ColumnDef<StockFeatures, TopRow>[]>(
    () => [
      userColumn((row) => ({ user: row.user })),
      numberColumn("count", "Connexions", (row) => row.count, undefined, true),
      userActionsColumn((row) => row.user, onSelectUser),
    ],
    [onSelectUser],
  );
  const recentColumns = useMemo<ColumnDef<StockFeatures, RecentRow>[]>(
    () => [
      dateTimeColumn((row) => row.time),
      userColumn((row) => ({ user: row.user })),
      textColumn("ip", "Adresse IP", (row) => row.from, "font-mono text-xs"),
      userActionsColumn((row) => row.user, onSelectUser),
    ],
    [onSelectUser],
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <div className="xl:col-span-2">
        <CollapsibleTable title="Personnes les plus connectées"
            rows={topRows}
            columns={topColumns}
            emptyMessage="Aucune connexion sur cette période."
            countLabel="Personnes"
          nested defaultOpen />
      </div>
      <div className="xl:col-span-3">
        <CollapsibleTable title="Dernières connexions"
            rows={recentRows}
            columns={recentColumns}
            emptyMessage="Aucune connexion sur cette période."
            countLabel="Connexions"
          nested defaultOpen />
      </div>
    </div>
  );
}
