import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import type StudentFeedback from "../../../utils/interfaces/student-feedback";
import FeelingLevel from "../../../components/UI/feeling-level";
import SortColumnIcon from "../../../components/UI/sort-column-icon/sort-column-icon";

type Props = {
  feedbacks: StudentFeedback[];
};

const columnHelper = createColumnHelper<StudentFeedback>();

const columns = [
  columnHelper.accessor("name", {
    header: "Nom",
    cell: (info) => (
      <span className="font-semibold">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("comment", {
    header: "Commentaire",
    cell: (info) => {
      const comment = info.getValue();
      return comment ? (
        <div className="tooltip tooltip-bottom text-left" data-tip={comment}>
          {comment}
        </div>
      ) : (
        "-"
      );
    },
  }),
  columnHelper.accessor("feelingLevel", {
    header: "Humeur",
    cell: (info) => <FeelingLevel value={info.getValue()} size={6} />,
  }),
  columnHelper.accessor("feedbackAt", {
    header: "Date",
    cell: (info) => {
      const date = new Date(info.getValue());
      return `${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`;
    },
  }),
  columnHelper.accessor("teacher", {
    header: "Vu par",
    cell: (info) => {
      const teacher = info.getValue();
      return teacher ? (
        <span className="capitalize">{teacher}</span>
      ) : (
        "-"
      );
    },
  }),
];

const FeedbacksList = ({ feedbacks }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => feedbacks, [feedbacks]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border-separate border-spacing-y-2">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortEntry = sorting[0];
                const currentSortField = sortEntry?.id ?? "";
                const currentSortDir = sortEntry ? !sortEntry.desc : false;
                return (
                  <th
                    key={header.id}
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-x-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <SortColumnIcon
                          fieldSort={currentSortField}
                          column={header.id}
                          direction={currentSortDir}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbacksList;
