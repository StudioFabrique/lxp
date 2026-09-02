import type { ColumnDef } from "@tanstack/react-table";
import { AvatarSmall } from "../avatar/AvatarSmall";

/** Ce qu'une ligne doit porter pour qu'on puisse afficher son avatar. */
export type TablePerson = {
  firstname: string;
  lastname: string;
  avatar?: string;
};

/**
 * Colonne de sélection des tableaux de personnes.
 *
 * La case à cocher est toujours accompagnée de l'avatar de la ligne : la photo
 * quand elle existe, les initiales sinon, comme partout ailleurs dans
 * l'application. Un tableau de personnes se parcourt d'abord des yeux, et une
 * ligne sans visage se confond avec ses voisines.
 */
export function personSelectionColumn<TData extends TablePerson>(
  selectAllLabel = "Sélectionner toutes les lignes affichées",
  canSelect: (row: TData) => boolean = () => true,
): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label={selectAllLabel}
        className="checkbox checkbox-sm checkbox-primary"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => {
      const { avatar, firstname, lastname } = row.original;
      const selectable = canSelect(row.original);

      return (
        <div className="flex items-center gap-x-3">
          <input
            type="checkbox"
            aria-label={`Sélectionner ${firstname} ${lastname}`}
            className="checkbox checkbox-sm checkbox-primary"
            checked={row.getIsSelected()}
            disabled={!selectable}
            onChange={row.getToggleSelectedHandler()}
          />
          <span className="ml-3">
            <AvatarSmall
              user={{ avatar, firstname, lastname }}
              noImgClassName="text-xs flex justify-center items-center p-3 w-5 h-5 rounded-full bg-accent text-secondary-content"
              imgClassName="w-6 h-6 rounded-full object-cover"
            />
          </span>
        </div>
      );
    },
    enableSorting: false,
  };
}
