import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Group from "../../../utils/interfaces/group";
import { Link } from "react-router";

export const getGroupColumns = (
  onDelete: (id: string) => void,
): ColumnDef<Group>[] => [
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
    accessorKey: "name",
    header: "Nom",
    cell: (info) => (
      <span className="font-semibold">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "formation",
    header: "Formation - Parcours",
    cell: ({ row }) => {
      const group = row.original;
      return (
        <Link
          to={`/admin/parcours/view/${group.parcoursId}`}
          className="link link-primary"
        >
          {group.formation}
        </Link>
      );
    },
  },
  {
    accessorKey: "nbStudents",
    header: "Nombre d'étudiants",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const groupId = row.original._id;

      if (!groupId) return;

      return (
        <div className="flex gap-2 justify-center">
          <Link
            to={`/admin/group/edit/${groupId}`}
            className="btn btn-ghost btn-xs btn-square text-primary tooltip"
            data-tip="Modifier"
          >
            <Pencil className="w-4 h-4" />
          </Link>

          <button
            onClick={() => onDelete(groupId)}
            className="btn btn-ghost btn-xs btn-square text-error tooltip"
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
