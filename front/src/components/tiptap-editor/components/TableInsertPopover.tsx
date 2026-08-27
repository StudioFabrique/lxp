import { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "./ui/Icon";
import { Surface } from "./ui/Surface";
import { ToolbarButton } from "./ui/Toolbar";

interface TableInsertPopoverProps {
  editor: Editor;
  title: string;
}

export const TableInsertPopover = ({
  editor,
  title,
}: TableInsertPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const maxRows = 8;
  const maxCols = 8;

  const handleCellHover = useCallback((row: number, col: number) => {
    setHoveredCell({ row, col });
  }, []);

  const handleInsertTable = useCallback(
    (rows: number, cols: number, withHeaderRow: boolean = true) => {
      editor
        .chain()
        .focus()
        .insertTable({
          rows,
          cols,
          withHeaderRow,
        })
        .run();
      setIsOpen(false);
    },
    [editor]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      handleInsertTable(row + 1, col + 1, true);
    },
    [handleInsertTable]
  );

  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const isHighlighted =
          hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col;
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`table-cell${isHighlighted ? " highlighted" : ""}`}
            data-highlighted={isHighlighted}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
            style={{
              width: "16px",
              height: "16px",
              border: "1px solid var(--color-base-300)",
              backgroundColor: isHighlighted
                ? "var(--color-primary)"
                : "var(--color-base-100)",
              cursor: "pointer",
              transition: "all 0.1s ease",
            }}
          />
        );
      }
    }
    return cells;
  };

  const getSelectionText = () => {
    if (!hoveredCell) return "Sélectionner la taille du tableau";
    return `${hoveredCell.row + 1} x ${hoveredCell.col + 1}`;
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <ToolbarButton className="flex w-full max-w-max items-center gap-3 rounded bg-transparent p-1.5 text-left text-sm font-medium select-none">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-base-content/60">
            <Icon name="Table" className="h-5 w-5" />
          </span>
          <span className="w-full text-base-content/60">
            {title}
          </span>
        </ToolbarButton>
      </Popover.Trigger>
      <Popover.Content
        className="absolute left-[4.6rem] bottom-0"
        sideOffset={10}
        asChild
      >
        <Surface className="p-4 w-80 bg-base-100">
          <div className="space-y-4">
            <div className="text-sm font-medium text-base-content">
              {getSelectionText()}
            </div>

            <div
              className="table-size-selector"
              onMouseLeave={() => setHoveredCell(null)}
            >
              <div
                className="table-grid rounded-lg border border-base-300 bg-base-200 p-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                  gap: "2px",
                }}
              >
                {renderGrid()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                Tableaux prédéfinis
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleInsertTable(2, 2, false)}
                  className="px-3 py-1 text-xs bg-base-200 hover:bg-base-300 rounded-lg transition-colors text-base-content"
                >
                  2x2
                </button>
                <button
                  onClick={() => handleInsertTable(3, 3, true)}
                  className="px-3 py-1 text-xs bg-base-200 hover:bg-base-300 rounded-lg transition-colors text-base-content"
                >
                  3x3
                </button>
                <button
                  onClick={() => handleInsertTable(4, 2, true)}
                  className="px-3 py-1 text-xs bg-base-200 hover:bg-base-300 rounded-lg transition-colors text-base-content"
                >
                  4x2
                </button>
                <button
                  onClick={() => handleInsertTable(5, 4, true)}
                  className="px-3 py-1 text-xs bg-base-200 hover:bg-base-300 rounded-lg transition-colors text-base-content"
                >
                  5x4
                </button>
              </div>
            </div>
          </div>
        </Surface>
      </Popover.Content>
    </Popover.Root>
  );
};
