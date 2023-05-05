/* eslint-disable react/jsx-key */
import { FC } from "react";
import { Column, useTable } from "react-table";
import Pagination from "../UI/pagination/pagination";

interface ReactTableProps {
  columns: readonly Column<any>[];
  data: any[];
  page: number;
  perPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  onSort: (column: number) => void;
}

const ReactTable: FC<ReactTableProps> = ({
  data,
  columns,
  page,
  totalPages,
  setPage,
  onSort,
}) => {
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    data,
    columns,
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <>
      <table className="table text-xs font-bold" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                // eslint-disable-next-line react/jsx-key
                <th
                  className="text-primary"
                  {...column.getHeaderProps()}
                  onClick={() => {
                    onSort(i);
                  }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr className="hover" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className="font-bold" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        page={page}
        setPage={handlePageChange}
        totalPages={totalPages}
      />
    </>
  );
};

export default ReactTable;
