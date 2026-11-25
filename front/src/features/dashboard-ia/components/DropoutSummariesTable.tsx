import { useMemo } from "react";
import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { DataTable } from "../../../components/table/DataTable";
import CardLabel from "../../observability/components/CardLabel";
import { formatNumber } from "../../../utils/helpers/format-number";
import { localeDate } from "../../../utils/helpers/locale-date";
import { groupAnalysisNameLines } from "../helpers/group-analysis-name";
import type { DropoutSummary } from "../api/dashboardIA.api";

type Row = DropoutSummary & { id: string };

type Props = { summaries: DropoutSummary[] };

export default function DropoutSummariesTable({ summaries }: Readonly<Props>) {
  const rows = useMemo<Row[]>(
    () => summaries.map((summary) => ({ ...summary, id: summary.groupId })),
    [summaries],
  );
  const columns = useMemo<ColumnDef<StockFeatures, Row>[]>(
    () => [
      {
        id: "group",
        header: "Promotion",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm font-semibold">
            {groupAnalysisNameLines(row.original.name).join(" / ")}
          </span>
        ),
      },
      {
        id: "analyzed",
        header: "Apprenants analysés",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm">
            <CardLabel>Apprenants analysés</CardLabel>
            {formatNumber(row.original.analyzed)}
          </span>
        ),
      },
      {
        id: "critical",
        header: "Cas critiques",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm">
            <CardLabel>Cas critiques</CardLabel>
            {formatNumber(row.original.critical)}
          </span>
        ),
      },
      {
        id: "completedAt",
        header: "Analyse du",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm">
            <CardLabel>Analyse du</CardLabel>
            {localeDate(row.original.completedAt)}
          </span>
        ),
      },
    ],
    [],
  );

  return <DataTable columns={columns} data={rows} />;
}
