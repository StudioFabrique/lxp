import { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "./ui/Icon";
import { Surface } from "./ui/Surface";
import { Toolbar } from "./ui/Toolbar";

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
            className="table-cell"
            data-highlighted={isHighlighted}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
            style={{
              width: "16px",
              height: "16px",
              border: "1px solid oklch(var(--b3))",
              backgroundColor: isHighlighted
                ? "oklch(var(--p))"
                : "oklch(var(--b1))",
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
        <Toolbar.Button className="flex items-center gap-3.5 p-1.5 text-sm font-medium text-left bg-transparent w-full max-w-max rounded select-none">
          <Icon name="Table" className="text-base-content/60 w-8" />
          <span className="text-base-content/60 w-full">
            {title}
          </span>
        </Toolbar.Button>
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
                className="rounded-lg border border-base-300 bg-base-200 p-2"
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
