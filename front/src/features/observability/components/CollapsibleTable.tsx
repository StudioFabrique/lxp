import type { ColumnDef, StockFeatures } from "@tanstack/react-table";
import { formatNumber } from "../../../utils/helpers/format-number";
import ActivityTable from "./ActivityTable";
import CollapsibleSection from "./CollapsibleSection";

type Props<T extends { id: string }> = {
  title: string;
  rows: T[];
  columns: ColumnDef<StockFeatures, T>[];
  emptyMessage: string;
  countLabel: string;
  defaultOpen?: boolean;
  nested?: boolean;
  /** Nombre de lignes montrées quand la section est repliée. */
  previewSize?: number;
};

/**
 * Tableau dans une section repliable. Replié, il garde ses premières lignes
 * visibles et propose de tout afficher ; déplié, il montre tout, paginé.
 */
export default function CollapsibleTable<T extends { id: string }>({
  title,
  rows,
  columns,
  emptyMessage,
  countLabel,
  defaultOpen = false,
  nested = false,
  previewSize = 3,
}: Readonly<Props<T>>) {
  const hasMore = rows.length > previewSize;

  return (
    <CollapsibleSection
      title={title}
      count={rows.length}
      defaultOpen={defaultOpen}
      nested={nested}
      expandLabel={hasMore ? `Voir tout (${formatNumber(rows.length)})` : undefined}
      preview={
        <ActivityTable
          rows={rows.slice(0, previewSize)}
          columns={columns}
          emptyMessage={emptyMessage}
          countLabel={countLabel}
          pageSize={previewSize}
        />
      }
    >
      <ActivityTable
        rows={rows}
        columns={columns}
        emptyMessage={emptyMessage}
        countLabel={countLabel}
      />
    </CollapsibleSection>
  );
}
