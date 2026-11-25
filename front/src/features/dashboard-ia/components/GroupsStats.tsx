import { useMemo } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { DataTable } from "../../../components/table/DataTable";
import CardLabel from "../../observability/components/CardLabel";
import type { GroupsStats as GroupsStatsType } from "../types";
import { formatNumber } from "../../../utils/helpers/format-number";

type Props = {
  stats: GroupsStatsType[];
  groupsTotalTokens: number;
};

const GroupsStats = ({ stats, groupsTotalTokens }: Props) => {
  const columns = useMemo<ColumnDef<StockFeatures, GroupsStatsType>[]>(
    () => [
      {
        id: "group",
        header: "Promotion",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="break-words text-sm font-semibold">
            {row.original.groupName}
          </span>
        ),
      },
      {
        id: "tokens",
        header: "Quantité",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-x-3 text-sm">
            <CardLabel>Quantité</CardLabel>
            <progress
              className="progress progress-primary w-full min-w-16 sm:w-28"
              value={row.original.totalTokens}
              max={groupsTotalTokens}
              aria-label={`${row.original.groupName} : ${formatNumber(row.original.totalTokens)} tokens`}
            />
            <span className="shrink-0">{formatNumber(row.original.totalTokens)}</span>
          </div>
        ),
      },
      {
        id: "percent",
        header: "%",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm">
            <CardLabel>Part</CardLabel>
            {formatNumber((row.original.totalTokens / groupsTotalTokens) * 100, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            %
          </span>
        ),
      },
    ],
    [groupsTotalTokens],
  );

  return <DataTable columns={columns} data={stats} />;
};

export default GroupsStats;
