import { useMemo } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityOverview, ActivityUser } from "../api/observability.api";
import {
  dateTimeColumn,
  textColumn,
  userActionsColumn,
  userColumn,
} from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Row = WithId<ActivityOverview["recentLogins"][number]>;

type Props = {
  logins: ActivityOverview["recentLogins"];
  onSelectUser: (user: ActivityUser) => void;
};

export default function RecentLoginsTable({ logins, onSelectUser }: Readonly<Props>) {
  const rows = useMemo(() => withIds(logins, (login) => login.time), [logins]);
  const columns = useMemo<ColumnDef<StockFeatures, Row>[]>(
    () => [
      dateTimeColumn((row) => row.time),
      userColumn((row) => ({ user: row.user })),
      textColumn("ip", "Adresse IP", (row) => row.from, "font-mono text-xs"),
      userActionsColumn((row) => row.user, onSelectUser),
    ],
    [onSelectUser],
  );

  return (
    <CollapsibleTable
      title="Dernières connexions"
      rows={rows}
      columns={columns}
      emptyMessage="Aucune connexion sur cette période."
      countLabel="Connexions"
    />
  );
}
