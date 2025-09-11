import { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import * as Popover from "@radix-ui/react-popover";
import { Toolbar } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";
import { Surface } from "./ui/Surface";

interface TableSizeSelectorProps {
  editor: Editor;
  onInsert?: () => void;
}

export const TableSizeSelector = ({
  editor,
  onInsert,
}: TableSizeSelectorProps) => {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const maxRows = 8;
  const maxCols = 8;

  const handleCellHover = useCallback((row: number, col: number) => {
    setHoveredCell({ row, col });
  }, []);

  const handleInsertTable = useCallback(
    (rows: number, cols: number) => {
      editor
        .chain()
        .focus()
        .insertTable({
          rows,
          cols,
          withHeaderRow: true,
        })
        .run();
      setIsOpen(false);
      onInsert?.();
    },
    [editor, onInsert]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      handleInsertTable(row + 1, col + 1);
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
            className={`table-cell ${isHighlighted ? "highlighted" : ""}`}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
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
        <Toolbar.Button
          tooltip="Insérer un tableau"
          active={editor.isActive("table")}
        >
          <Icon name="Table" />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Content side="bottom" sideOffset={8} asChild>
        <Surface className="p-4 w-fit">
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              {getSelectionText()}
            </div>
            <div
              className="table-size-selector"
              onMouseLeave={() => setHoveredCell(null)}
            >
              <div
                className="table-grid"
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
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => handleInsertTable(3, 3)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                3×3 (par défaut)
              </button>
              <button
                onClick={() => handleInsertTable(5, 5)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                5×5
              </button>
            </div>
          </div>
        </Surface>
      </Popover.Content>
    </Popover.Root>
  );
};
