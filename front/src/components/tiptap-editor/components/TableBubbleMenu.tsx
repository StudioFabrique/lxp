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
      className="fixed z-50 flex gap-1 rounded-lg border border-base-300 bg-base-100 p-2 text-base-content shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
    >
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded p-2 text-base-content transition-colors hover:bg-base-200"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Ajouter ligne avant"
      >
        <Icon name="ArrowUp" />
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded p-2 text-base-content transition-colors hover:bg-base-200"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Ajouter ligne après"
      >
        <Icon name="ArrowDown" />
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded p-2 text-base-content transition-colors hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-30"
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
        title="Supprimer la ligne"
      >
        <Icon name="TableRowsSplit" />
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded p-2 text-base-content transition-colors hover:bg-base-200"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Ajouter colonne avant"
      >
        <Icon name="ArrowLeft" />
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded p-2 text-base-content transition-colors hover:bg-base-200"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Ajouter colonne après"
      >
        <Icon name="ArrowRight" />
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded p-2 text-base-content transition-colors hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-30"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
        title="Supprimer la colonne"
      >
        <Icon name="TableColumnsSplit" />
      </button>
      <div className="mx-1 w-px bg-base-300"></div>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded p-2 text-base-content transition-colors hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-30"
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
        title="Fusionner les cellules sélectionnées"
      >
        <Icon name="Combine" />
      </button>
      <div className="mx-1 w-px bg-base-300"></div>
      <button
        type="button"
        className="flex items-center gap-2 rounded p-2 text-sm text-error transition-colors hover:bg-error/10"
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Supprimer tableau"
      >
        <Icon name="Trash" />
        Supprimer le tableau
      </button>
    </div>
  );
};
