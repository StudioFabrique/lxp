import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TableViewProps extends NodeViewProps {
  node: any;
  updateAttributes: (attributes: Record<string, unknown>) => void;
  deleteNode: () => void;
}

export const ResizableTableView = ({
  node,
  updateAttributes,
  deleteNode,
  ...props
}: TableViewProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{
    startX: number;
    startWidth: number;
    columnIndex: number;
  } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, columnIndex: number) => {
      if (!tableRef.current) return;

      const rect = tableRef.current.getBoundingClientRect();
      const cells = tableRef.current.querySelectorAll(
        `td:nth-child(${columnIndex + 1}), th:nth-child(${columnIndex + 1})`
      );
      const firstCell = cells[0] as HTMLElement;

      if (firstCell) {
        setIsResizing(true);
        setResizeData({
          startX: e.clientX,
          startWidth: firstCell.offsetWidth,
          columnIndex,
        });
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeData || !tableRef.current) return;

      const deltaX = e.clientX - resizeData.startX;
      const newWidth = Math.max(50, resizeData.startWidth + deltaX); // Minimum width of 50px

      // Update the width of all cells in the column
      const cells = tableRef.current.querySelectorAll(
        `td:nth-child(${resizeData.columnIndex + 1}), th:nth-child(${
          resizeData.columnIndex + 1
        })`
      );

      cells.forEach((cell: Element) => {
        (cell as HTMLElement).style.width = `${newWidth}px`;
        (cell as HTMLElement).style.minWidth = `${newWidth}px`;
      });
    },
    [isResizing, resizeData]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeData(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const renderTable = () => {
    // Create a copy of the table with resize handles
    const tableElement = document.createElement("div");
    tableElement.innerHTML = props.node.textContent;

    return (
      <div className="relative table-wrapper">
        <table
          ref={tableRef}
          className={`tiptap-table ${node.attrs.class || ""}`}
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          {/* The actual table content will be rendered by TipTap */}
        </table>

        {/* Column resize handles */}
        {tableRef.current && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {Array.from({ length: node.firstChild?.childCount || 0 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 w-1 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity cursor-col-resize pointer-events-auto"
                  style={{
                    right: `${
                      (100 / (node.firstChild?.childCount || 1)) * index
                    }%`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                />
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <NodeViewWrapper className="table-node-view">
      {renderTable()}
    </NodeViewWrapper>
  );
};
