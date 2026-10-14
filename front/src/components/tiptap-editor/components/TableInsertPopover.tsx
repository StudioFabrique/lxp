import { useId, useState, type KeyboardEvent } from "react";
import type { Editor } from "@tiptap/react";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "./ui/Icon";
import { ToolbarButton } from "./ui/Toolbar";
import { cn } from "../../../utils/cn";

interface TableInsertPopoverProps {
  editor: Editor;
  title: string;
}

const maxRows = 8;
const maxCols = 8;
const presets = [
  { rows: 2, cols: 2, withHeaderRow: false },
  { rows: 3, cols: 3, withHeaderRow: true },
  { rows: 4, cols: 2, withHeaderRow: true },
  { rows: 5, cols: 4, withHeaderRow: true },
];

export const TableInsertPopover = ({ editor, title }: TableInsertPopoverProps) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const handleInsertTable = (rows: number, cols: number, withHeaderRow = true): void => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
    setIsOpen(false);
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLButtonElement>, row: number, col: number): void => {
    let nextRow = row;
    let nextCol = col;
    switch (event.key) {
      case "ArrowRight": nextCol = Math.min(col + 1, maxCols - 1); break;
      case "ArrowLeft": nextCol = Math.max(col - 1, 0); break;
      case "ArrowDown": nextRow = Math.min(row + 1, maxRows - 1); break;
      case "ArrowUp": nextRow = Math.max(row - 1, 0); break;
      case "Home": nextCol = 0; break;
      case "End": nextCol = maxCols - 1; break;
      default: return;
    }
    event.preventDefault();
    const nextIndex = nextRow * maxCols + nextCol;
    const nextButton = event.currentTarget.parentElement?.children.item(nextIndex);
    if (nextButton instanceof HTMLButtonElement) nextButton.focus();
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      setHoveredCell(null);
      setFocusIndex(0);
    }}>
      <Popover.Trigger asChild>
        <ToolbarButton type="button" className="flex w-full max-w-max items-center gap-3 rounded bg-transparent p-1.5 text-left text-sm font-medium select-none">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-base-content/60">
            <Icon name="Table" className="h-5 w-5" />
          </span>
          <span className="w-full text-base-content/60">{title}</span>
        </ToolbarButton>
      </Popover.Trigger>
      <Popover.Portal>
      <Popover.Content side="bottom" align="start" sticky="always" sideOffset={8} collisionPadding={12}
        aria-labelledby={`${id}-title`}
        className="z-50 w-80 max-w-[calc(100vw-1.5rem)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-xl border border-base-300 bg-base-100 p-4 text-base-content shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 id={`${id}-title`} className="font-semibold">Insérer un tableau</h3>
            <span className="badge badge-primary badge-soft whitespace-nowrap" aria-live="polite" aria-atomic="true">
              {hoveredCell ? `${hoveredCell.row + 1} × ${hoveredCell.col + 1}` : "8 × 8 max."}
            </span>
          </div>
          <p id={`${id}-hint`} className="text-xs text-base-content/60">
            Choisissez les lignes et les colonnes. Utilisez les flèches au clavier, puis Entrée.
          </p>
          <div className="grid grid-cols-8 gap-1 rounded-xl border border-base-300 bg-base-200/50 p-2"
            role="group" aria-label="Dimensions du tableau" aria-describedby={`${id}-hint`}
            onMouseLeave={() => {
              if (!document.activeElement?.closest(`[data-table-selector="${id}"]`)) setHoveredCell(null);
            }} data-table-selector={id}>
            {Array.from({ length: maxRows * maxCols }, (_, index) => {
              const row = Math.floor(index / maxCols);
              const col = index % maxCols;
              const highlighted = !!hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col;
              return <button key={index} type="button" tabIndex={focusIndex === index ? 0 : -1}
                aria-label={`${row + 1} ${row === 0 ? "ligne" : "lignes"}, ${col + 1} ${col === 0 ? "colonne" : "colonnes"}`}
                className={cn(
                  "aspect-square rounded border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  highlighted ? "border-primary bg-primary/80" : "border-base-300 bg-base-100 hover:border-primary",
                )}
                onMouseEnter={() => setHoveredCell({ row, col })}
                onFocus={() => { setFocusIndex(index); setHoveredCell({ row, col }); }}
                onKeyDown={(event) => handleGridKeyDown(event, row, col)}
                onClick={() => handleInsertTable(row + 1, col + 1)}
              />;
            })}
          </div>
          <div className="space-y-2 border-t border-base-300 pt-3">
            <p className="text-xs font-medium text-base-content/60">Formats rapides (lignes × colonnes)</p>
            <div className="grid grid-cols-4 gap-2">
              {presets.map(({ rows, cols, withHeaderRow }) => (
                <button key={`${rows}-${cols}`} type="button" className="btn btn-sm btn-soft"
                  aria-label={`Insérer ${rows} lignes et ${cols} colonnes${withHeaderRow ? " avec en-tête" : " sans en-tête"}`}
                  onClick={() => handleInsertTable(rows, cols, withHeaderRow)}>
                  {rows} × {cols}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
