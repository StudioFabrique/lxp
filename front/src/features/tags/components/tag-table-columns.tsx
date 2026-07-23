import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import type { TagRow } from "../api/tag.api";

export const getTagColumns = (
  onDelete: (id: number) => void,
): ColumnDef<TagRow>[] => [
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
    header: "Titre",
    cell: (info) => (
      <span className="font-semibold">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "totalUses",
    header: "No. d'utilisation",
    enableSorting: false,
  },
  {
    accessorKey: "parcours",
    header: "Parcours",
    enableSorting: false,
    cell: ({ row }) => {
      const parcours = row.original.parcours;
      return (
        <div className="flex flex-wrap gap-1">
          {parcours.length > 0 ? (
            parcours.map((p) => (
              <ParcoursLink key={p.id} id={p.id} title={p.title} />
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const tagId = row.original.id;
      return (
        <div className="flex gap-2 justify-center">
          <Link
            to={`?openModal=true&editId=${tagId}`}
            className="btn btn-ghost btn-xs btn-square text-primary tooltip"
            data-tip="Modifier"
          >
            <Pencil className="w-4 h-4" />
          </Link>

          <button
            onClick={() => onDelete(tagId)}
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

function ParcoursLink({ id, title }: { id: number; title: string }) {
  return (
    <a
      href={`/admin/parcours/view/${id}`}
      className="badge badge-primary badge-outline p-3 hover:badge-primary transition-colors"
    >
      {title}
    </a>
  );
}
