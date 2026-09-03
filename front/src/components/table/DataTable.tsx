import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { SortAsc, SortDesc } from "lucide-react";
import EmptyStatePlaceholder from "../UI/empty-state-placeholder";
import TableOverflowContainer from "./TableOverflowContainer";
import "./DataTable.css";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  isRowClickable?: (row: TData) => boolean;
  canSelectRow?: (row: TData) => boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection = {},
  setRowSelection,
  sorting = [],
  setSorting,
  isLoading,
  emptyMessage = "Aucun élément disponible",
  onRowClick,
  isRowClickable = () => true,
  canSelectRow = () => true,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    return isLoading ? null : <EmptyStatePlaceholder title={emptyMessage} />;
  }

  return (
    <TableOverflowContainer>
      <table className="data-table table w-full min-w-full border-separate border-spacing-y-5">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isActionsColumn = header.column.id === "actions";
                return (
                  <th
                    key={header.id}
                    className={`text-base-content pl-6 ${
                      isActionsColumn ? "text-center" : ""
                    }`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
                          isActionsColumn ? "w-full justify-center" : ""
                        } ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`}
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

        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isClickable = !!onRowClick && isRowClickable(row.original);
            return (
              <tr
                key={row.id}
                className={`text-base-content group ${
                  isClickable ? "cursor-pointer" : ""
                }`}
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
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`pl-6 bg-base-100 first:rounded-l-xl last:rounded-r-xl group-hover:bg-base-100/60 transition-colors ${
                      cell.column.id === "actions"
                        ? "data-table-actions text-center"
                        : ""
                    }`}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
