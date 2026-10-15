import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import type { TagRow } from "../api/tag.api";
import TagItem from "../../../components/UI/tag-item/tag-item";
import { formatTitle } from "../../../utils/helpers/text-helpers";
import type { ColumnBreakpoint } from "../../../components/table/DataTable";

/**
 * Sans en-tête (affichage en cartes sous 48rem), un nombre seul n'a plus de sens :
 * le nombre d'utilisations n'est affiché que lorsque son titre l'est aussi.
 */
export const TAG_COLUMN_BREAKPOINTS: Record<string, ColumnBreakpoint> = {
  totalUses: "3xl",
};

export const getTagColumns = (
  onDelete: (id: number) => void,
): ColumnDef<StockFeatures, TagRow>[] => [
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
        disabled={!row.getCanSelect()}
        aria-label={
          row.getCanSelect()
            ? `Sélectionner le tag ${row.original.name}`
            : `Le tag ${row.original.name} ne peut pas être supprimé`
        }
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Titre",
    cell: ({ row }) => (
      <TagItem
        tag={{
          id: row.original.id,
          name: row.original.name,
          color: row.original.color,
        }}
        noIcon
      />
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
              <a
                key={p.id}
                href={`/admin/parcours/view/${p.id}`}
                className="badge badge-primary badge-outline p-3 hover:badge-primary transition-colors"
              >
                {formatTitle(p.title)}
              </a>
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
          {row.original.canUpdate ? (
            <Link
              to={`?openModal=true&editId=${tagId}`}
              className="btn btn-ghost btn-xs btn-square text-primary tooltip"
              data-tip="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </Link>
          ) : null}

          {row.original.canDelete ? (
            <button
              onClick={() => onDelete(tagId)}
              className="btn btn-ghost btn-xs btn-square text-error tooltip"
              data-tip="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      );
    },
    enableSorting: false,
  },
];
