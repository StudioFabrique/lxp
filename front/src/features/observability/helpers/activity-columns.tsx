import type { ColumnDef, RowData, StockFeatures } from "@tanstack/react-table";
import CardLabel from "../components/CardLabel";
import RouteLabel from "../components/RouteLabel";
import UserActivityButton from "../components/UserActivityButton";
import UserLabel from "../components/UserLabel";
import type { ActivityTarget, ActivityUser } from "../api/observability.api";
import { formatNumber } from "../../../utils/helpers/format-number";
import { localeDate, localeTime } from "../../../utils/helpers/locale-date";

/** Fabriques de colonnes partagées par les tableaux des journaux (`DataTable`). */
type Column<T extends RowData> = ColumnDef<StockFeatures, T>;

export const dateTimeColumn = <T extends RowData>(
  read: (row: T) => string,
  id = "date",
  header = "Date",
): Column<T> => ({
  id,
  header,
  enableSorting: false,
  cell: ({ row }) => {
    const value = read(row.original);
    return (
      <span className="whitespace-nowrap text-sm">
        <CardLabel>{header}</CardLabel>
        {localeDate(value)} {localeTime(value)}
      </span>
    );
  },
});

export const routeColumn = <T extends RowData>(
  read: (row: T) => { method: string; path: string; targets?: ActivityTarget[] },
): Column<T> => ({
  id: "route",
  header: "Route",
  enableSorting: false,
  cell: ({ row }) => {
    const { method, path, targets } = read(row.original);
    return (
      <div className="py-2">
        <RouteLabel method={method} path={path} targets={targets} />
      </div>
    );
  },
});

export const userColumn = <T extends RowData>(
  read: (row: T) => { user: ActivityUser | null; anonymous?: boolean; system?: boolean },
  header = "Personne",
): Column<T> => ({
  id: "person",
  header,
  enableSorting: false,
  cell: ({ row }) => {
    const { user, anonymous, system } = read(row.original);
    return <UserLabel user={user} anonymous={anonymous} system={system} />;
  },
});

export const textColumn = <T extends RowData>(
  id: string,
  header: string,
  read: (row: T) => string,
  className?: string,
): Column<T> => ({
  id,
  header,
  enableSorting: false,
  cell: ({ row }) => (
    <span className={className ?? "text-sm"}>{read(row.original)}</span>
  ),
});

export const numberColumn = <T extends RowData>(
  id: string,
  header: string,
  read: (row: T) => number,
  unit?: string,
  bold = false,
): Column<T> => ({
  id,
  header,
  enableSorting: false,
  cell: ({ row }) => (
    <span className={bold ? "text-sm font-bold" : "text-sm"}>
      <CardLabel>{header}</CardLabel>
      {formatNumber(read(row.original))}
      {unit ? ` ${unit}` : ""}
    </span>
  ),
});

export const userActionsColumn = <T extends RowData>(
  read: (row: T) => ActivityUser | null,
  onSelectUser: (user: ActivityUser) => void,
): Column<T> => ({
  id: "actions",
  header: () => <div className="text-center">Actions</div>,
  enableSorting: false,
  cell: ({ row }) => (
    <div className="flex items-center justify-center">
      <UserActivityButton
        user={read(row.original)}
        onSelectUser={onSelectUser}
      />
    </div>
  ),
});
