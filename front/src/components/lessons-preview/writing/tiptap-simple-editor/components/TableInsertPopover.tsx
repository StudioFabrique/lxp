import { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "./ui/Icon";
import { Surface } from "./ui/Surface";

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
              border: "1px solid #d1d5db",
              backgroundColor: isHighlighted ? "#3b82f6" : "white",
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
    return `${hoveredCell.row + 1} × ${hoveredCell.col + 1}`;
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-3.5 p-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 text-left bg-transparent w-full max-w-max rounded hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
        >
          <Icon name="Table" className="w-4 h-4" />
          {title}
        </button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="start" sideOffset={8} asChild>
        <Surface className="p-4 w-80">
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">
              {getSelectionText()}
            </div>

            <div
              className="table-size-selector"
              onMouseLeave={() => setHoveredCell(null)}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                  gap: "2px",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  backgroundColor: "#f9fafb",
                }}
              >
                {renderGrid()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Tableaux prédéfinis
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleInsertTable(2, 2, false)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  2x2
                </button>
                <button
                  onClick={() => handleInsertTable(3, 3, true)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  3x3
                </button>
                <button
                  onClick={() => handleInsertTable(4, 2, true)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  4x2
                </button>
                <button
                  onClick={() => handleInsertTable(5, 4, true)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
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
