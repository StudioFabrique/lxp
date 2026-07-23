import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import type { RoleCounts } from "../api/role.api";
import PermissionGuard from "../../../components/guards/PermissionGuard";

export const getRoleColumns = (
  onDelete: (id: string) => void,
): ColumnDef<RoleCounts>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <PermissionGuard action="delete" object="role">
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-primary"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      </PermissionGuard>
    ),
    cell: ({ row }) => (
      <PermissionGuard action="delete" object="role">
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-primary"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </PermissionGuard>
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
      return (
        <div className="flex gap-2 justify-center">
          <PermissionGuard action="update" object="role">
            <Link
              to={`edit/${roleId}`}
              className="btn btn-ghost btn-xs btn-square text-primary tooltip"
              data-tip="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </Link>
          </PermissionGuard>

          <PermissionGuard action="delete" object="role">
            <button
              onClick={() => onDelete(roleId)}
              className="btn btn-ghost btn-xs btn-square text-error tooltip"
              data-tip="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </PermissionGuard>
        </div>
      );
    },
    enableSorting: false,
  },
];
