import type { ColumnDef, StockFeatures, SortingState, Updater } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";
import { AvatarSmall } from "../../../../../components/avatar/AvatarSmall";
import { DataTable } from "../../../../../components/table/DataTable";
import { formatTitle, toTitleCase } from "../../../../../utils/helpers/text-helpers";
import { localeDate } from "../../../../../utils/helpers/locale-date";
import type { StudentWithGroup } from "../../../hooks/useParcoursStudentsQuery";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";

interface StudentsListTableProps {
  list: StudentWithGroup[];
  fieldSort: string;
  direction: boolean;
  sortData: (column: string) => void;
  emptyMessage?: string;
}

const StudentsListTable = ({ list, fieldSort, direction, sortData, emptyMessage }: StudentsListTableProps) => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const formationTitle = parcours?.formation.title;
  const columns = useMemo<ColumnDef<StockFeatures, StudentWithGroup>[]>(() => [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => <AvatarSmall user={{
        firstname: row.original.firstname,
        lastname: row.original.lastname,
        avatar: row.original.avatar,
      }} />,
      enableSorting: false,
    },
    {
      accessorKey: "firstname",
      header: "Prénom",
      cell: (info) => <span className="capitalize">{toTitleCase(info.getValue() as string)}</span>,
    },
    {
      accessorKey: "lastname",
      header: "Nom",
      cell: (info) => <span className="capitalize">{toTitleCase(info.getValue() as string)}</span>,
    },
    { accessorKey: "email", header: "Email" },
    {
      id: "formation",
      header: "Formation",
      cell: () => formatTitle(formationTitle),
      enableSorting: false,
    },
    {
      id: "group",
      header: "Groupe",
      cell: ({ row }) => formatTitle(row.original.group?.name),
    },
    {
      accessorKey: "createdAt",
      header: "Ajouté le",
      cell: (info) => {
        const date = info.getValue() as Date | undefined;
        return date ? localeDate(date) : "";
      },
    },
  ], [formationTitle]);

  const sorting: SortingState = fieldSort ? [{ id: fieldSort, desc: !direction }] : [];
  const handleSortingChange = (updater: Updater<SortingState>) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    if (next.length > 0) sortData(next[0].id);
  };

  return (
    <DataTable
      columns={columns}
      data={list}
      sorting={sorting}
      setSorting={handleSortingChange}
      isSearching={Boolean(emptyMessage)}
      emptyMessage={emptyMessage}
    />
  );
};

export default StudentsListTable;
