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
    getRowId: (row: any) => row._id || row.id,
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
    <div className="w-full overflow-x-auto">
      <table className="table border-separate border-spacing-y-5">
        <thead className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {/* Espacement gauche typique de ton design */}
              <th className="p-0 w-0" />

              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} className="text-base-content">
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
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

              {/* Espacement droit */}
              <th className="px-0" />
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-base-100 hover:bg-base-100/60 text-base-content rounded-xl transition-colors"
            >
              <td className="rounded-l-xl w-0" />

              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}

              <td className="rounded-r-xl w-0" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
