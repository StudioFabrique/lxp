import {
  flexRender,
  stockFeatures,
  useTable,
  ColumnDef,
  type RowData,
  type StockFeatures,
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { ChevronRight, SortAsc, SortDesc } from "lucide-react";
import EmptyStatePlaceholder from "../UI/empty-state-placeholder";
import TableOverflowContainer from "./TableOverflowContainer";
import "./DataTable.css";
import { cn } from "../../utils/cn";
import LoadingSkeleton from "../loaders/LoadingSkeleton";

/**
 * Largeur minimale du conteneur du tableau à partir de laquelle une colonne
 * s'affiche (container queries Tailwind). En dessous, elle est masquée pour
 * éviter le défilement horizontal.
 */
export type ColumnBreakpoint = "3xl" | "4xl" | "5xl" | "6xl" | "7xl";

// Noms de classes complets pour que Tailwind les détecte à la compilation.
const SHOW_FROM_CLASSNAMES: Record<ColumnBreakpoint, string> = {
  "3xl": "hidden @3xl:table-cell",
  "4xl": "hidden @4xl:table-cell",
  "5xl": "hidden @5xl:table-cell",
  "6xl": "hidden @6xl:table-cell",
  "7xl": "hidden @7xl:table-cell",
};

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<StockFeatures, TData>[];
  data: TData[];
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  isLoading?: boolean;
  isSearching?: boolean;
  emptyMessage?: string;
  emptyPlaceholderWithBorder?: boolean;
  onRowClick?: (row: TData) => void;
  isRowClickable?: (row: TData) => boolean;
  canSelectRow?: (row: TData) => boolean;
  /** Colonnes secondaires (id de colonne) masquées sous une largeur de conteneur. */
  columnBreakpoints?: Record<string, ColumnBreakpoint>;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  rowSelection = {},
  setRowSelection,
  sorting = [],
  setSorting,
  isLoading,
  isSearching = false,
  emptyMessage = "Aucun élément disponible",
  emptyPlaceholderWithBorder,
  onRowClick,
  isRowClickable = () => true,
  canSelectRow = () => true,
  columnBreakpoints = {},
}: DataTableProps<TData>) {
  const table = useTable<StockFeatures, TData>({
    features: stockFeatures,
    data,
    columns,
    getRowId: (row) => {
      const identifiableRow = row as TData & {
        _id?: string;
        id?: string | number;
      };
      return String(identifiableRow._id ?? identifiableRow.id);
    },
    state: {
      rowSelection,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    manualSorting: true,
    enableRowSelection: (row) => canSelectRow(row.original),
  });

  if (data.length === 0) {
    return isLoading ? <LoadingSkeleton variant="rows" label="Chargement du tableau" /> : (
      <EmptyStatePlaceholder
        title={emptyMessage}
        withBorder={emptyPlaceholderWithBorder ?? !isSearching}
      />
    );
  }

  return (
    <TableOverflowContainer>
      <table className="data-table table w-full min-w-full border-separate border-spacing-y-5 bg-transparent @max-3xl:block @max-3xl:border-spacing-0">
        {/* Sous 48rem de conteneur, les lignes deviennent des cartes : les en-têtes restent lisibles pour les technologies d'assistance. */}
        <thead className="@max-3xl:sr-only">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isActionsColumn = header.column.id === "actions";
                return (
                  <th
                    key={header.id}
                    className={cn(
                      "text-base-content pl-3 @3xl:pl-6",
                      isActionsColumn && "w-[1%] whitespace-nowrap pr-3 text-center @3xl:pr-6",
                      columnBreakpoints[header.column.id] && SHOW_FROM_CLASSNAMES[columnBreakpoints[header.column.id]],
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn("flex items-center gap-1", isActionsColumn && "w-full justify-center", header.column.getCanSort() && "cursor-pointer select-none")}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {/* Indicateurs de tri */}
                        {{
                          asc: <SortAsc className="w-4 h-4 ml-1" />,
                          desc: <SortDesc className="w-4 h-4 ml-1" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="@max-3xl:flex @max-3xl:flex-col @max-3xl:gap-3">
          {table.getRowModel().rows.map((row) => {
            const isClickable = !!onRowClick && isRowClickable(row.original);
            return (
              <tr
                key={row.id}
                className={cn(
                  "text-base-content group",
                  "@max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-4 @max-3xl:gap-y-1 @max-3xl:rounded-xl @max-3xl:border @max-3xl:border-base-300/50 @max-3xl:bg-base-100 @max-3xl:p-3",
                  isClickable && "cursor-pointer",
                )}
                // La ligne entière sert de lien
                role={isClickable ? "link" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={
                  isClickable ? () => onRowClick(row.original) : undefined
                }
                onKeyDown={
                  isClickable
                    ? (event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        onRowClick(row.original);
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell, cellIndex, cells) => (
                  <td
                    key={cell.id}
                    className={cn("@max-3xl:border-0 @max-3xl:first:border-l-0 @max-3xl:last:border-r-0 @max-3xl:rounded-none @max-3xl:first:rounded-none @max-3xl:last:rounded-none @max-3xl:bg-transparent @max-3xl:group-hover:bg-transparent @max-3xl:p-0 @max-3xl:pl-0 border-y border-base-300/50 pl-3 @3xl:pl-6 bg-base-100 text-base-content first:rounded-l-xl first:border-l last:rounded-r-xl last:border-r group-hover:bg-base-100/60 transition-colors", cell.column.id === "actions" && "data-table-actions w-[1%] whitespace-nowrap pr-3 text-center @3xl:pr-6 @max-3xl:ml-auto @max-3xl:w-auto @max-3xl:pr-0", columnBreakpoints[cell.column.id] && SHOW_FROM_CLASSNAMES[columnBreakpoints[cell.column.id]])}
                    // Sélection et actions sont des commandes propres à la
                    // cellule : leur clic ne doit pas déclencher la navigation
                    // portée par la ligne.
                    onClick={
                      cell.column.id === "select" ||
                      cell.column.id === "actions"
                        ? (event) => event.stopPropagation()
                        : undefined
                    }
                  >
                    {isClickable && cellIndex === cells.length - 1 ? (
                      // Ligne cliquable : un chevron glisse en place au survol ou au focus de la ligne.
                      <div className="flex items-center justify-center gap-1">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        <ChevronRight
                          className="size-5 shrink-0 -translate-x-2 text-primary opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableOverflowContainer>
  );
}
