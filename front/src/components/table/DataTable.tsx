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
import TableEmpty from "./TableEmpty";
import FadeWrapper from "../wrappers/FadeWrapper";
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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection = {},
  setRowSelection,
  sorting = [],
  setSorting,
  isLoading,
  emptyMessage = "Aucune donnée disponible",
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
  });

  if (!isLoading && data.length === 0) {
    return (
      <FadeWrapper>
        <TableEmpty message={emptyMessage} />
      </FadeWrapper>
    );
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="text-base-content group cursor-pointer">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`pl-6 bg-base-100 first:rounded-l-xl last:rounded-r-xl group-hover:bg-base-100/60 transition-colors ${
                    cell.column.id === "actions"
                      ? "data-table-actions text-center"
                      : ""
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableOverflowContainer>
  );
}
