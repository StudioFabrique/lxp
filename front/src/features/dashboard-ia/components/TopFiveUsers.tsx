import { useMemo } from "react";
import { Link } from "react-router";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { DataTable } from "../../../components/table/DataTable";
import CardLabel from "../../observability/components/CardLabel";
import type { TopUser } from "../types";
import { formatNumber } from "../../../utils/helpers/format-number";

type Props = {
  topUsers: TopUser[];
  /** Libellé de la colonne des personnes (« Apprenant »). */
  userLabel: string;
};

const TopFiveUsers = ({ topUsers, userLabel }: Props) => {
  const columns = useMemo<ColumnDef<StockFeatures, TopUser>[]>(
    () => [
      {
        id: "user",
        header: userLabel,
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            to={`/admin/teacher/student/${row.original._id}`}
            className="link link-hover text-sm font-semibold"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        id: "tokens",
        header: "Quantité",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm">
            <CardLabel>Quantité</CardLabel>
            {formatNumber(row.original.totalTokens)}
          </span>
        ),
      },
    ],
    [userLabel],
  );

  return <DataTable columns={columns} data={topUsers} />;
};

export default TopFiveUsers;
