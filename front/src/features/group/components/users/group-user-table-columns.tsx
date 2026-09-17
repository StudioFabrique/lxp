import { toTitleCase } from "../../../../utils/helpers/text-helpers";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type User from "../../../../utils/interfaces/user";
import UserStatusToggle from "../../../user/components/UserStatusToggle";
import { personSelectionColumn } from "../../../../components/table/person-selection-column";

const selectionColumn = personSelectionColumn<User>(
  "Sélectionner tous les étudiants affichés",
);

const identityColumns: ColumnDef<StockFeatures, User>[] = [
  {
    accessorKey: "firstname",
    header: "Prénom",
    cell: ({ getValue }) => (
      <span className="capitalize">{toTitleCase(getValue() as string)}</span>
    ),
  },
  {
    accessorKey: "lastname",
    header: "Nom",
    cell: ({ getValue }) => (
      <span className="capitalize">{toTitleCase(getValue() as string)}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export const getAvailableStudentColumns = (): ColumnDef<StockFeatures, User>[] => [
  selectionColumn,
  ...identityColumns,
  {
    id: "status",
    header: "Statut",
    cell: ({ row }) => (
      <UserStatusToggle isActive={row.original.isActive} />
    ),
    enableSorting: false,
  },
];

export const getGroupStudentColumns = ({
  onDeleteUser,
}: {
  onDeleteUser: (user: User) => void;
}): ColumnDef<StockFeatures, User>[] => [
  selectionColumn,
  ...identityColumns,
  {
    accessorKey: "formation",
    header: "Formation",
    cell: ({ getValue }) => (getValue() as string | undefined) ?? "ND",
  },
  {
    id: "status",
    header: "Statut",
    cell: ({ row }) => (
      <UserStatusToggle isActive={row.original.isActive} />
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <button
        type="button"
        className="btn btn-ghost btn-xs btn-square text-error tooltip"
        data-tip="Retirer du groupe"
        onClick={() => onDeleteUser(row.original)}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    ),
    enableSorting: false,
  },
];
