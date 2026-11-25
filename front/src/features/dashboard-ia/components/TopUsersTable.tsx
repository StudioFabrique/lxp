import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type {
  ColumnDef,
  SortingState,
  StockFeatures,
  Updater,
} from "@tanstack/react-table";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import { DataTable } from "../../../components/table/DataTable";
import TablePagination from "../../../components/table/TablePagination";
import CardLabel from "../../observability/components/CardLabel";
import { useDebouncedValue } from "../../observability/hooks/useDebouncedValue";
import type { TopUser } from "../types";
import { useRoleLabels } from "../../role/hooks/useRoleLabels";
import { formatNumber } from "../../../utils/helpers/format-number";

type Props = {
  dataList: TopUser[];
  totalItems: number;
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  perPage: number;
  sortProperty: string;
  sortDirection: string;
  setPerPage: (v: number) => void;
  setPage: (v: number) => void;
  onSort: (property: string) => void;
  onSearch: (value: string) => void;
};

const TopUsersTable = ({
  dataList,
  totalItems,
  isLoading,
  isError,
  page,
  totalPages,
  perPage,
  sortProperty,
  sortDirection,
  setPerPage,
  setPage,
  onSort,
  onSearch,
}: Props) => {
  const { labels, teamLabel } = useRoleLabels();
  const [searchInput, setSearchInput] = useState("");
  const searchText = useDebouncedValue(searchInput.trim());
  const isSearching = searchText.length > 0;

  // Une requête par recherche, pas une par lettre tapée.
  useEffect(() => {
    onSearch(searchText);
  }, [searchText, onSearch]);

  const sorting = useMemo<SortingState>(
    () => [{ id: sortProperty, desc: sortDirection === "desc" }],
    [sortProperty, sortDirection],
  );

  // Le tri est fait par le serveur : `onSort` inverse le sens si la colonne est déjà triée.
  const handleSortingChange = (updater: Updater<SortingState>) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    onSort(next[0]?.id ?? sortProperty);
  };

  const columns = useMemo<ColumnDef<StockFeatures, TopUser>[]>(
    () => [
      {
        id: "lastname",
        accessorFn: (row) => row.name,
        header: "Utilisateur",
        cell: ({ row }) =>
          row.original.role === "student" ? (
            <Link
              to={`/admin/teacher/student/${row.original._id}`}
              className="link link-hover text-sm font-semibold"
            >
              {row.original.name}
            </Link>
          ) : (
            <span className="text-sm font-semibold">{row.original.name}</span>
          ),
      },
      {
        id: "role",
        accessorFn: (row) => row.role,
        header: "Rôle",
        cell: ({ row }) => (
          <span className="text-sm">
            <CardLabel>Rôle</CardLabel>
            {row.original.role === "student" ? labels[3] : teamLabel}
          </span>
        ),
      },
      {
        id: "groupName",
        accessorFn: (row) => row.groupName ?? "",
        header: "Promotion",
        cell: ({ row }) => (
          <span className="text-sm">
            <CardLabel>Promotion</CardLabel>
            {row.original.groupName ?? "-"}
          </span>
        ),
      },
      {
        id: "totalTokens",
        accessorFn: (row) => row.totalTokens,
        header: "Quantité",
        cell: ({ row }) => (
          <span className="text-sm font-bold">
            <CardLabel>Quantité</CardLabel>
            {formatNumber(row.original.totalTokens)}
          </span>
        ),
      },
      {
        id: "createdAt",
        accessorFn: (row) => row.lastActivity,
        header: "Dernière utilisation",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm">
            <CardLabel>Dernière utilisation</CardLabel>
            {row.original.lastActivity}
          </span>
        ),
      },
    ],
    [labels, teamLabel],
  );

  return (
    <BoxWrapper>
      <MultiCriteriaSearch
        value={searchInput}
        onChange={setSearchInput}
        placeholder="Rechercher par nom d'utilisateur"
        criteria={["nom d'utilisateur"]}
      />
      {isError && (
        <p role="alert">
          Impossible de charger les consommations. Modifiez la recherche ou réessayez.
        </p>
      )}
      <DataTable
        columns={columns}
        data={dataList}
        isLoading={isLoading}
        isSearching={isSearching}
        sorting={sorting}
        setSorting={handleSortingChange}
        emptyMessage={
          isSearching
            ? "Aucun utilisateur pour cette recherche"
            : "Aucune consommation enregistrée"
        }
      />
      {dataList.length > 0 && (
        <TablePagination
          currentPage={page}
          maxPage={totalPages}
          itemsPerPage={perPage}
          leftText={`Utilisateurs : ${formatNumber(totalItems)}`}
          scrollToTopOnChange={false}
          onSetCurrentPage={setPage}
          onSetItemsPerPage={(itemsPerPage) => {
            setPerPage(itemsPerPage);
            setPage(1);
          }}
          onSetPreviousPage={() => setPage(Math.max(page - 1, 1))}
          onSetNextPage={() => setPage(Math.min(page + 1, totalPages))}
        />
      )}
    </BoxWrapper>
  );
};

export default TopUsersTable;
