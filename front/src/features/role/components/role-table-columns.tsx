import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import type { RoleCounts } from "../role.api";

export const getRoleColumns = (
  onDelete: (id: string) => void,
): ColumnDef<RoleCounts>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="checkbox checkbox-sm checkbox-primary"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="checkbox checkbox-sm checkbox-primary"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "label",
    header: "Rôle",
    cell: (info) => (
      <span className="font-semibold capitalize">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "countRead",
    header: "Lire",
    enableSorting: false,
  },
  {
    accessorKey: "countWrite",
    header: "Créer",
    enableSorting: false,
  },
  {
    accessorKey: "countUpdate",
    header: "Modifier",
    enableSorting: false,
  },
  {
    accessorKey: "countDelete",
    header: "Supprimer",
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const roleId = row.original._id;
      const navigate = useNavigate();

      return (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => navigate(`edit/${roleId}`)}
            className="btn btn-ghost btn-xs tooltip"
            data-tip="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(roleId)}
            className="btn btn-ghost btn-xs text-error tooltip"
            data-tip="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    },
    enableSorting: false,
  },
];
