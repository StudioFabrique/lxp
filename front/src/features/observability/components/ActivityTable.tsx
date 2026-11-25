import { useState } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { DataTable } from "../../../components/table/DataTable";
import TablePagination from "../../../components/table/TablePagination";
import { formatNumber } from "../../../utils/helpers/format-number";

type Props<T extends { id: string }> = {
  rows: T[];
  columns: ColumnDef<StockFeatures, T>[];
  /** Message affiché sans ligne. */
  emptyMessage: string;
  /** Début du compteur de la barre de pagination (« Connexions » : « Connexions : 20 »). */
  countLabel: string;
  pageSize?: number;
};

/**
 * Tableau des journaux : `DataTable` et `TablePagination` du projet. La barre de
 * pagination n'apparaît que si les lignes dépassent une page.
 */
export default function ActivityTable<T extends { id: string }>({
  rows,
  columns,
  emptyMessage,
  countLabel,
  pageSize = 10,
}: Readonly<Props<T>>) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);

  // Pas de composant d'état vide du projet ici : il occupe la hauteur restante de l'écran.
  if (rows.length === 0) {
    return <p className="text-base-content/70">{emptyMessage}</p>;
  }

  const maxPage = Math.max(1, Math.ceil(rows.length / limit));
  const currentPage = Math.min(page, maxPage);
  const visibleRows = rows.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="flex flex-col gap-2">
      <DataTable columns={columns} data={visibleRows} />
      {rows.length > pageSize && (
        <TablePagination
          currentPage={currentPage}
          maxPage={maxPage}
          itemsPerPage={limit}
          leftText={`${countLabel} : ${formatNumber(rows.length)}`}
          scrollToTopOnChange={false}
          onSetCurrentPage={setPage}
          onSetItemsPerPage={(itemsPerPage) => {
            setLimit(itemsPerPage);
            setPage(1);
          }}
          onSetPreviousPage={() => setPage(Math.max(currentPage - 1, 1))}
          onSetNextPage={() => setPage(Math.min(currentPage + 1, maxPage))}
        />
      )}
    </div>
  );
}
