import { useMemo } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import type { ActivityDetails, ActivityUser } from "../api/observability.api";
import {
  dateTimeColumn,
  numberColumn,
  userActionsColumn,
  userColumn,
} from "../helpers/activity-columns";
import { withIds, type WithId } from "../helpers/table-rows";
import CollapsibleTable from "./CollapsibleTable";

type Data = Extract<ActivityDetails, { kind: "active-users" }>;
type Row = WithId<Data["users"][number]>;

type Props = {
  data: Data;
  onSelectUser: (user: ActivityUser) => void;
};

export default function ActiveUsersDetail({ data, onSelectUser }: Props) {
  const rows = useMemo(() => withIds(data.users, (row) => row.userId), [data.users]);
  const columns = useMemo<ColumnDef<StockFeatures, Row>[]>(
    () => [
      userColumn((row) => ({ user: row.user })),
      numberColumn("hits", "Requêtes", (row) => row.hits, undefined, true),
      dateTimeColumn((row) => row.last, "last", "Dernière activité"),
      userActionsColumn((row) => row.user, onSelectUser),
    ],
    [onSelectUser],
  );

  return (
    <CollapsibleTable title="Comptes les plus actifs"
        rows={rows}
        columns={columns}
        emptyMessage="Aucune activité sur cette période."
        countLabel="Comptes"
      nested defaultOpen />
  );
}
