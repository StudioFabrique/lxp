import { Editor } from "@tiptap/react";
import { useEffect, useState, useRef } from "react";
import { Icon } from "./ui/Icon";

interface TableBubbleMenuProps {
  editor: Editor;
}

export const TableBubbleMenu = ({ editor }: TableBubbleMenuProps) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!editor.isActive("table")) {
        setShow(false);
        return;
      }

      const { selection } = editor.state;
      const { from } = selection;

      // Get the DOM element for the current position
      const domAtPos = editor.view.domAtPos(from);
      const element = domAtPos.node as Element;

      // Find the table element
      const tableElement = element.closest("table");

      if (tableElement) {
        const rect = tableElement.getBoundingClientRect();
        setPosition({
          top: rect.top - 45, // Position above the table
          left: rect.left + rect.width / 2 - 150, // Center horizontally
        });
        setShow(true);
      } else {
        setShow(false);
      }
    };

    const handleSelectionUpdate = () => {
      setTimeout(updatePosition, 10);
    };

    if (editor) {
      editor.on("selectionUpdate", handleSelectionUpdate);
      editor.on("transaction", handleSelectionUpdate);
    }

    return () => {
      if (editor) {
        editor.off("selectionUpdate", handleSelectionUpdate);
        editor.off("transaction", handleSelectionUpdate);
      }
    };
  }, [editor]);

  if (!show) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
    >
      <button
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Ajouter ligne avant"
      >
        <Icon name="ArrowUp" className="w-4 h-4 text-base-content" />
      </button>
      <button
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Ajouter ligne après"
      >
        <Icon name="ArrowDown" className="w-4 h-4 text-base-content" />
      </button>
      <button
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Ajouter colonne avant"
      >
        <Icon name="ArrowLeft" className="w-4 h-4 text-base-content" />
      </button>
      <button
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Ajouter colonne après"
      >
        <Icon name="ArrowRight" className="w-4 h-4 text-base-content" />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
        title="Fusionner les cellules sélectionnées"
      >
        <Icon name="Combine" className="w-4 h-4 text-base-content" />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        className="flex text-sm items-center gap-2 p-2 hover:bg-red-100 rounded transition-colors text-red-500"
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Supprimer tableau"
      >
        <Icon name="Trash" className="w-4 h-4 text-base-content" />
        Supprimer le tableau
      </button>
    </div>
  );
};
